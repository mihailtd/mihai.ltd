---
title: "CloudNativePG"
description: "Open-source, Kubernetes-native PostgreSQL operator leveraging native controller quorum and Barman Cloud, placed in trial for greenfield clusters and streamlined GitOps."
date: "2026-10-10"
type: "tech_report"
tags:
  [
    "cloudnativepg",
    "postgresql",
    "kubernetes",
    "databases",
    "cnpg",
    "barman-cloud",
    "storage",
    "gitops",
    "cloud-native",
  ]
placements:
  - category: "platforms"
    subCategory: "databases"
  - category: "infrastructure"
    subCategory: "storage"
stage: "trial"
decision: "trial"
evaluatedScore: 4
satisfaction: 5
decisionReason: "Placed in trial for greenfield Kubernetes clusters and developer environments. Removes external consensus daemons by relying directly on native PostgreSQL streaming replication and the Kubernetes API controller. Delivers cleaner GitOps ergonomics and faster bootstrap times."
decidedDate: "2026-10-10"
link: "https://cloudnative-pg.io/"
target: "_blank"
cover_image: "/images/covers/radar-cloudnativepg.png"
---

# CloudNativePG: The Next-Generation Kubernetes-Native PostgreSQL Engine

For over three years, **[Crunchy Data PGO](/blog/crunchy-pgo)** anchored our database deployments on Kubernetes. It established that stateful relational data could survive node reboots, volume re-attachments, and network failovers.

Yet as Kubernetes architectures matured, a new paradigm emerged: rather than wrapping legacy database clustering tools inside container wrappers, build an operator that treats Kubernetes itself as the native clustering foundation.

That philosophy defines **CloudNativePG (CNPG)**. Originally authored by EnterpriseDB (EDB) and donated to the Cloud Native Computing Foundation (CNCF), CloudNativePG has entered **Trial** across our technology radar as our prime candidate for greenfield workloads, modern GitOps clusters, and edge infrastructure.

---

## Architectural Philosophy: Built for Kubernetes from Day One

Older operators relied on external consensus engines like Patroni, etcd sidecars, or dedicated daemon pods to manage high availability. CloudNativePG discards this external tooling.

```text
                      ┌──────────────────────────┐
                      │ CloudNativePG Controller │
                      │ (K8s API Leader Leases)  │
                      └─────────────┬────────────┘
                                    │ reconciles
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
   ┌──────────────┐                                    ┌──────────────┐
   │ Primary Pod  │◀───────── Streaming Replication ───│ Replica Pod  │
   │ PostgreSQL   │                                    │ PostgreSQL   │
   │ + Instance   │                                    │ + Instance   │
   │   Manager    │                                    │   Manager    │
   └──────┬───────┘                                    └──────────────┘
          │
          └──────────── Direct S3 Object Streaming ───────────┐
                                                              ▼
                                                   [ Barman Cloud Object Store ]
```

### 1. Daemonless Instance Management

Each database pod runs a Go binary (`instance manager`) as PID 1 alongside the PostgreSQL server. The instance manager handles lifecycle events, configuration reloading, and certificate management. Because it interacts directly with the Kubernetes API server using native Leader Election Leases, failover decisions happen within seconds without third-party consensus software.

### 2. Barman Cloud: Low-Overhead Object Storage Backups

Rather than maintaining a persistent backup repository pod like Crunchy's `pgBackRest` repo host, CloudNativePG integrates **Barman Cloud** directly into the instance manager:

- The database process streams Write-Ahead Logs (WAL) continuously and directly into AWS S3, Cloudflare R2, Google Cloud Storage, or MinIO.
- Full and incremental physical backups stream directly to the target bucket without buffering to local scratch disks.
- Removing dedicated backup pods saves CPU and memory across small and multi-tenant clusters.

### 3. GitOps-First CRD Design

CloudNativePG features an exceptionally clean manifest schema. Bootstrapping a production three-node cluster with automated backups and replication takes fewer than 40 lines of YAML under a single `Cluster` custom resource:

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: production-db
spec:
  instances: 3
  storage:
    size: 50Gi
    storageClass: local-path
  backup:
    barmanObjectStore:
      destinationPath: s3://backups-bucket/pg/
      s3Credentials:
        inheritFromIAMRole: true
      wal:
        compression: gzip
```

ArgoCD or Flux reconciles declarative changes—such as scaling replicas, modifying configuration parameters, or rotating TLS certificates—without drift warnings.

### 4. Native Connection Pooling via `Pooler`

Engineers declare connection pooling using a companion custom resource: `Pooler`. CloudNativePG automatically provisions scalable PgBouncer deployments connected directly to the primary service, providing automated authentication secret synchronization with zero manual configuration files.

---

## Why CloudNativePG Is in "Trial" Rather than Immediate "Adopt"

CloudNativePG has achieved functional excellence, but we maintain deliberate evaluation gates before replacing an adopted standard:

- Crunchy PGO's `pgBackRest` retains a capability edge in complex enterprise disaster recovery scenarios requiring simultaneous, independent writes to distinct physical locations.
- Running production databases on Crunchy PGO have operated for years without data loss. Upgrading active databases across different operator paradigms is a deliberate operational procedure, not an arbitrary swap.
- As an incubating CNCF project, its ecosystem of third-party extensions and enterprise automation plugins continues to mature.

---

## Verdict & Next Steps

CloudNativePG represents the modern architecture for PostgreSQL on Kubernetes. We recommend it for:

- Greenfield deployments across local workstations, staging, and production clusters.
- GitOps workflows requiring minimal YAML boilerplate and fast reconciliation.
- Edge and homelab clusters where teams must minimize memory overhead.

Read our complete architectural comparison: **[PostgreSQL on Kubernetes in 2026: Crunchy Data PGO vs. CloudNativePG](/blog/postgres-kubernetes-pgo-vs-cloudnativepg)**.
