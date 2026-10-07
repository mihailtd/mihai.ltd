---
title: "Autoscaling n8n Workers with KEDA on Kubernetes"
description: "A production playbook for autoscaling n8n queue-mode workers with KEDA, deployed through Argo CD on a k3s cluster."
date: "2026-09-28"
type: "blog_post"
tags: ["kubernetes", "keda", "n8n", "autoscaling", "devops"]
cover_image: "/images/covers/keda-autoscaling.png"
---

# How to Autoscale Workflow Automation on Kubernetes: Queue Depth, Concurrency, and Safe Scale-Down

_A production playbook for autoscaling n8n queue-mode workers with KEDA, deployed through Argo CD on a k3s cluster._

> **[COVER IMAGE]** Clean architecture illustration: a queue in the center, worker pods fanning out and collapsing around it, Kubernetes and n8n marks in a corner. Title text overlaid: "Autoscale on the queue."

Workflow automation on Kubernetes scales on queue depth. Run the execution tier as stateless queue workers, let KEDA add workers when jobs pile up, and size the scale-down so a departing worker finishes its executions before the pod disappears. The data tier sets the ceiling, so the database connection budget caps the worker count.

This article walks through that setup on my own lab: n8n in queue mode on a single-node k3s cluster, deployed with Argo CD, autoscaled by KEDA. It picks up where [my reference architecture for n8n on Kubernetes](https://www.linkedin.com/pulse/how-deploy-workflow-automation-kubernetes-scale-reference-architecture-vskhf/) ends. That piece gets n8n into queue mode, and this article takes it from there.

## What does the cluster look like?

The lab is a single-node k3s cluster on my workstation. One node is enough to exercise the scaling behavior, since the limits that matter here come from the queue, the grace period, and the database, not from node capacity.

Everything on the cluster is managed with GitOps. Argo CD follows the app-of-apps pattern: one root Application points at a directory of child Applications in a Git repository, and each child owns one component. Adding a component means committing one more Application file, and removing it means deleting that file. The children that matter for this article are KEDA, the CloudNativePG operator, the observability stack, and n8n itself, installed from the [official n8n Helm chart](https://github.com/n8n-io/n8n-hosting/tree/main/charts/n8n).

The data tier runs in the cluster. PostgreSQL runs on [CloudNativePG](https://cloudnative-pg.io/), which manages the database as a `Cluster` resource. The queue broker is [Valkey](https://valkey.io/), the open-source fork of Redis. It speaks the Redis protocol, so n8n's Bull queue and KEDA's Redis scaler work against it unchanged, and everything below applies equally to Redis.

For monitoring and observability the cluster runs the Grafana LGTM stack: Grafana Alloy collects metrics, logs, and Kubernetes events, Mimir stores metrics, Loki stores logs, Tempo stores traces, and Grafana puts them on dashboards. Every graph in this article comes from that stack.

In queue mode, n8n runs as three roles: a main instance that serves the editor and API and enqueues executions, webhook processors that take production webhook traffic, and workers that pull execution IDs from a Redis list and run them. Each role responds to a different load signal. This article focuses on the workers, where autoscaling pays off most.

> **[DIAGRAM 1: Architecture]** Ingress → main + webhook processors → Valkey (`bull:jobs:wait`) → worker Deployment (KEDA ScaledObject attached) → PostgreSQL (CloudNativePG). On the side: a Git repository feeding Argo CD's root Application, which fans out to the child Applications (KEDA, CloudNativePG, LGTM, n8n); Alloy scraping n8n and KEDA into Mimir, with Grafana on top. Match the visual style of the LinkedIn reference-architecture diagrams.

Each child is an ordinary Argo CD Application. The n8n one points Argo CD at the chart's OCI registry and takes its values from the Git repository:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: n8n
  namespace: argocd
spec:
  project: default
  sources:
    - repoURL: ghcr.io/n8n-io/n8n-helm-chart
      chart: n8n
      targetRevision: 1.13.0
      helm:
        valueFiles:
          - $values/apps/n8n/values.yaml
    - repoURL: https://github.com/<you>/homelab.git
      targetRevision: main
      ref: values
  destination:
    server: https://kubernetes.default.svc
    namespace: n8n
  syncPolicy:
    automated: { prune: true, selfHeal: true }
```

The chart needs no special handling under Argo CD. It renders the same output under `helm template` as under `helm install`, and it omits `spec.replicas` from the worker Deployment whenever an autoscaler owns it. Argo CD and KEDA never fight over the replica count, so no `ignoreDifferences` block is needed.

> **[SCREENSHOT 1]** Argo CD UI, n8n Application tree view: main, webhook-processor, and worker Deployments, the worker ScaledObject, and the HPA that KEDA generates. All resources Synced and Healthy.

## How is the lab loaded?

The lab needs workflows that behave like real ones: most of their time goes to waiting on other systems. Two test workflows start from a webhook and call a slow HTTP endpoint in the cluster. The short one waits 6 seconds, like a typical sync against a SaaS API. The long one makes three slow calls in a row and runs for about eight minutes, which stands in for a report build, a batch export, or a long-running AI agent working through a chain of LLM and tool calls.

[k6](https://k6.io/) drives the webhooks. One scenario ramps to a steady arrival rate of short executions, and another fires a burst of long ones at once. k6 pushes its own request metrics to Mimir, so the load shows up on the same Grafana dashboard as the queue and the replica count.

## Why doesn't CPU autoscaling work for workflow workers?

A workflow worker spends most of an execution waiting on HTTP APIs, LLM responses, and database round-trips. CPU stays flat while the queue grows, so a CPU-based Horizontal Pod Autoscaler never sees the load. An [n8n community thread](https://community.n8n.io/t/n8n-kubernetes-queue-mode-jobs-not-distributed-across-multiple-workers-hpa-scaling-not-working/270471) documents the pattern: thousands of queued jobs, workers at roughly 10% CPU, and an HPA that never fires.

Lowering the CPU target makes the HPA fire, but the autoscaler still reads a proxy for load instead of the load itself.

Queue-worker engines differ from pod-per-step engines here. [Argo Workflows](https://argo-workflows.readthedocs.io/en/latest/scaling/) schedules a pod for each step, so the cluster scheduler absorbs demand. n8n runs executions inside long-lived workers, so demand shows up as backlog in the queue, and the autoscaler has to read that backlog directly.

> **[GRAPH 1]** Grafana panel from a k6 ramp with a CPU-based HPA on the workers: worker CPU (flat, ~10%) overlaid on `n8n_scaling_mode_queue_jobs_waiting` (climbing into the hundreds) over the same 10 minutes. Caption: "Worker CPU stays near 10% while the waiting queue climbs past [N] jobs."

## How do you scale workers on queue depth with KEDA?

[KEDA](https://keda.sh/) watches an external signal and drives an HPA on your behalf. The n8n chart ships a ScaledObject for workers that uses KEDA's [Redis Lists scaler](https://keda.sh/docs/latest/scalers/redis-lists/) against Bull's waiting list:

```yaml
queueMode:
  enabled: true
  workerConcurrency: 10

keda:
  enabled: true
  worker:
    pollingInterval: 15
    cooldownPeriod: 300
    minReplicaCount: 1
    maxReplicaCount: 8
    triggers:
      - type: redis
        metadata:
          listName: "bull:jobs:wait"
          listLength: "5"
```

`listLength` is a per-replica target. KEDA asks for enough workers that each one faces about five waiting jobs, so a backlog of 40 drives the Deployment toward eight replicas. The chart defaults `minReplicaCount` to 2; the lab lowers it to 1. Keep it at 1 or more for webhook-driven workflows, because a floor of zero adds pod start-up time to the first execution after an idle period.

The chart derives the trigger's address from `redis.host`, and the KEDA operator resolves that name from its own namespace. Set `redis.host` to the fully qualified service name (`valkey.<namespace>.svc.cluster.local`), or the ScaledObject never becomes ready.

> **[SCREENSHOT 2]** Terminal: `kubectl get scaledobject,hpa -n n8n` showing the ScaledObject READY/ACTIVE and the generated `keda-hpa-n8n-worker` with its current and target metric values.

The Redis scaler reads only the waiting list. That keeps it fast and independent of Prometheus, and it also leaves a gap during scale-down.

## Why does a waiting-only signal scale down busy workers?

Take a batch of 60 long-running executions: report builds that spend eight minutes waiting on downstream systems, or AI agents working through a long chain of calls. Eight workers pick them up, the waiting list drops to zero, and the Redis scaler reports zero demand. The HPA computes a desired count of zero, clamps it to `minReplicaCount`, and after its default five-minute scale-down stabilization window starts terminating workers that still run executions.

The waiting list counts only unclaimed jobs, so workers running active executions never register in the signal.

n8n publishes both numbers. With `N8N_METRICS=true` and `N8N_METRICS_INCLUDE_QUEUE_METRICS=true`, the main instance publishes `n8n_scaling_mode_queue_jobs_waiting` and `n8n_scaling_mode_queue_jobs_active` to Prometheus every 20 seconds by default. A Prometheus trigger can scale on their sum. Any Prometheus-compatible query API works; in the lab, KEDA queries Mimir:

```yaml
config:
  extraEnv:
    - name: N8N_METRICS
      value: "true"
    - name: N8N_METRICS_INCLUDE_QUEUE_METRICS
      value: "true"

keda:
  worker:
    triggers:
      - type: prometheus
        metadata:
          serverAddress: http://mimir.monitoring.svc:9009/prometheus
          query: sum(n8n_scaling_mode_queue_jobs_waiting) + sum(n8n_scaling_mode_queue_jobs_active)
          threshold: "8"
```

The query ties the replica count to worker capacity. With a concurrency of 10 and a threshold of 8, KEDA targets 80% utilization per worker: 60 jobs in flight hold eight workers, and the count falls only as executions finish.

The trade-off is latency. The signal passes through three intervals before KEDA acts on it: n8n's queue-metrics refresh, the metrics scrape, and KEDA's polling interval. With a 60-second scrape that adds up to more than a minute and a half, so the lab scrapes n8n every 15 seconds and refreshes the queue metrics every 10. The queue metrics also require a single main instance.

> **[GRAPH 2]** Side-by-side Grafana panels from the same 60-execution k6 burst. Left, Redis trigger: replicas drop while active jobs stay high, with cancelled executions marked. Right, Prometheus trigger: replicas track waiting + active and step down as executions complete.

## What happens to an execution when a worker scales down?

Kubernetes runs the pod's `preStop` hook first, then sends SIGTERM, then waits up to `terminationGracePeriodSeconds` before sending SIGKILL. The n8n source code defines what the worker does inside that window.

On SIGTERM, the worker pauses its queue consumer and stops claiming jobs. It then waits for running executions, bounded by `N8N_GRACEFUL_SHUTDOWN_TIMEOUT` (default 30 seconds). At 80% of that budget it cancels the stragglers and records them as cancelled, and at 100% it force-exits.

Two details in that sequence shape the configuration.

First, the `preStop` sleep drains nothing on a worker. Workers pull from the queue instead of receiving traffic through a Service, so a worker keeps claiming new jobs during the sleep. The sleep only consumes part of the grace period.

Second, a SIGKILL costs more than a cancellation. n8n configures Bull with no stalled-job retries, so when a worker dies mid-run, nothing picks its job back up. The execution stays marked as running until the leader's queue recovery check, which runs every 180 minutes by default, marks it as crashed.

The budget rule follows directly:

```
terminationGracePeriodSeconds ≥ preStop sleep + N8N_GRACEFUL_SHUTDOWN_TIMEOUT + margin
N8N_GRACEFUL_SHUTDOWN_TIMEOUT  > typical execution duration
```

The chart defaults (60 seconds of grace, a 10-second sleep, a 30-second n8n timeout) satisfy the first line. Workflows that run for minutes need a longer timeout, or a dedicated worker pool with its own grace period and a less aggressive scale-down.

> **[DIAGRAM 2: Scale-down timeline]** Horizontal timeline from 0 to 60 s: preStop sleep (0–10 s, worker still claiming jobs), SIGTERM at 10 s (queue paused), drain window to 34 s (80% of the 30 s budget), cancellation, force-exit at 40 s, SIGKILL deadline at 60 s. Mark the "crashed" outcome if SIGKILL lands first.

> **[SCREENSHOT 3]** n8n Executions list after a forced scale-down test: one execution marked Cancelled (graceful path) next to the same workflow's successful runs.

## Where does PostgreSQL fit?

Scaling PostgreSQL is a topic of its own and outside the scope of this article, but it sets the ceiling for everything above. Every n8n instance, whether main, webhook processor, or worker, opens its own connection pool against a single database host, so each worker KEDA adds claims more connections on the same primary.

The pool is sized by `DB_POSTGRESDB_POOL_SIZE` (default 2). Eight workers plus main and two webhook processors hold 22 connections, well under PostgreSQL's default `max_connections` of 100. Teams that raise the pool size to cut contention at high concurrency multiply that figure by the replica count, and a jump to `maxReplicaCount: 40` with a pool of 5 claims 200 connections before anything else connects. Derive `maxReplicaCount` from the connection budget as well as from load.

CloudNativePG covers the next steps without leaving Kubernetes:

- **Connection pooling.** The [`Pooler` resource](https://cloudnative-pg.io/documentation/current/connection_pooling/) runs PgBouncer in front of the cluster, so many n8n pools share a small number of server connections.
- **Vertical scaling.** Changing the `Cluster` resources triggers a rolling update: the operator updates the replicas first, then switches over to an updated one, keeping downtime to a switchover.
- **Replicas and failover.** Raising `instances` adds streaming replicas and automated failover. n8n sends all traffic to the primary through the read-write service, so replicas add availability rather than read capacity.

The operator also exports PostgreSQL metrics, so connections against `max_connections` sit on a Grafana dashboard next to the worker count.

## How do you size it? A worked example

Take a peak of 600 executions per minute with an average duration of 6 seconds. Concurrent executions at peak equal the arrival rate times the duration: 10 per second × 6 seconds = 60. At a concurrency of 10 and an 80% target, that needs eight workers, so `maxReplicaCount: 10` leaves headroom. The database side needs (10 × 2) + 6 = 26 connections at the default pool size.

Execution durations drift as workflows change, so measure them from n8n's metrics and recompute before each growth step.

## Key takeaways

- Autoscale n8n workers on queue metrics with KEDA; the official Helm chart enables it with `keda.enabled: true`.
- Include active jobs in the signal, or scale-down will interrupt long-running executions.
- Budget the grace period: `terminationGracePeriodSeconds` ≥ `preStop` + `N8N_GRACEFUL_SHUTDOWN_TIMEOUT` + margin.
- Cap `maxReplicaCount` with the PostgreSQL connection budget, and put a pooler in front before you approach it.

---

_Disclosure: I'm a member of the n8n Creators program. All configuration in this article runs on my own single-node k3s lab cluster._

<!--
EDITOR NOTES (remove before publishing)

Tags: Kubernetes · n8n · Workflow Automation · KEDA · DevOps
Publication: DevOps/Kubernetes-focused publication; Level Up Coding as fallback.

Verified against source (n8n 2.40.5 / master + n8n-hosting chart 1.13.0, 2026-09-29):
- Worker concurrency default 10 (commands/worker.ts); warns below 5
- N8N_GRACEFUL_SHUTDOWN_TIMEOUT default 30 s (generic.config.ts); chart sets it from redis.worker.timeout (30)
- Worker shutdown: pause queue → drain → cancel at 80% of budget → force-exit at 100% (scaling.service.ts stopWorker, base-command.ts)
- Bull maxStalledCount forced to 0 (scaling.service.ts setupQueue) → abandoned jobs are not retried
- Queue recovery marks dangling executions crashed; N8N_EXECUTIONS_QUEUE_RECOVERY_INTERVAL default 180 min
- DB_POSTGRESDB_POOL_SIZE default 2; database config has a single host, no read-replica setting (database.config.ts)
- Queue name "jobs", prefix "bull" → bull:jobs:wait
- Queue metrics: exposed on main, default interval 20 s (N8N_METRICS_QUEUE_METRICS_INTERVAL), "not supported in multi-main setup"
- Chart: keda.worker defaults (polling 15, cooldown 300, min 2, max 20, listLength 5); lifecycle grace 60 + preStop sleep 10; DESIGN.md states Argo CD compatibility

Verified on the lab cluster (2026-09-29):
- Worker Deployment renders without spec.replicas when KEDA owns it; Argo CD Synced/Healthy with the generated HPA
- Short redis.host breaks the ScaledObject ("lookup valkey ... no such host" from the keda namespace); FQDN fixes it
- n8n_scaling_mode_queue_jobs_waiting/active reach Mimir; KEDA operator metrics too
- Lab settings: N8N_METRICS_QUEUE_METRICS_INTERVAL=10, n8n scraped every 15 s, KEDA polling 15 s
- Long test workflow runs ~8 min (3 × 160 s calls) so it outlasts the HPA's 5 min scale-down window; a 90 s workflow would finish before any worker is removed

To confirm on the lab cluster:
- Prometheus trigger: chart 1.13.0 renders an empty `address:` for non-Redis triggers; the lab strips it with a Kustomize patch. Confirm KEDA accepts the result (not mentioned in the article)
- The Application snippet is illustrative (multi-source OCI + $values); the lab itself renders the chart through Kustomize
- Measured numbers: [N] in Graph 1 caption, replica counts in Graph 2, worked example at 600/min
- Worked-example connection count assumes main + 2 webhook processors at pool size 2 (= 6)
- Chart sets QUEUE_WORKER_MAX_STALLED_COUNT=1, but current n8n overrides maxStalledCount to 0; not mentioned in the article, worth a footnote only if a reviewer raises it
-->
