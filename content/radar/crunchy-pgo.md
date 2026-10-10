---
title: "Crunchy Data PGO"
description: "PostgreSQL operator for Kubernetes powered by pgBackRest, adopted for mission-critical databases and complex multi-datacenter disaster recovery."
date: "2026-10-10"
type: "tech_report"
tags:
  [
    "crunchy-pgo",
    "postgresql",
    "kubernetes",
    "databases",
    "pgbackrest",
    "storage",
    "devops",
    "gitops",
  ]
placements:
  - category: "platforms"
    subCategory: "databases"
  - category: "infrastructure"
    subCategory: "storage"
stage: "adopt"
decision: "adopt"
evaluatedScore: 4
satisfaction: 5
decisionReason: "Adopted as our production standard for stateful PostgreSQL workloads on Kubernetes. Relies on pgBackRest for unmatched delta backup and point-in-time recovery capabilities, automated failover, and mature PgBouncer connection pooling."
decidedDate: "2026-10-10"
link: "https://access.crunchydata.com/documentation/postgres-operator/latest/"
target: "_blank"
cover_image: "/images/covers/radar-crunchy-pgo.png"
---

# Crunchy Data PGO: Automated PostgreSQL for Kubernetes

Running stateful relational databases inside Kubernetes used to provoke pushback from systems engineers. The primary fear centered on operational failure during failovers, split-brain scenarios, and backup corruption.

**Crunchy Data PostgreSQL Operator (PGO)** addressed those concerns directly. Developed by PostgreSQL contributors and built for production reliability, Crunchy PGO has served as our unconditional **Adopt** for mission-critical database clusters across bare-metal k3s nodes and cloud infrastructure.

While modern contenders like **[CloudNativePG](/radar/cloudnativepg)** offer streamlined GitOps ergonomics, Crunchy PGO remains our standard where backup durability, multi-destination retention, and disaster recovery cannot fail.

---

## The Architecture: Why PGO Earned "Adopt" Status

Crunchy PGO v5 replaced older controller architectures with a declarative, reconciler-driven model centered around the `PostgresCluster` custom resource definition.

```text
                      ┌──────────────────────────┐
                      │   Crunchy PGO Operator   │
                      │   (Reconciliation Loop)  │
                      └─────────────┬────────────┘
                                    │ manages
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
   │ Primary Pod  │◀─────────┤ Replica Pod  │          │ Dedicated    │
   │ PostgreSQL   │ stream   │ PostgreSQL   │          │ pgBackRest   │
   │ + Exporter   │ rep      │ + Exporter   │          │ Repo Host    │
   └──────┬───────┘          └──────────────┘          └──────┬───────┘
          │                                                   │
          └────────────── WAL Archive & Backups ──────────────┘
                                    │
                                    ▼
                         [ S3 / MinIO / Local PVC ]
```

### 1. The Standard in Backups: pgBackRest

The decisive factor keeping Crunchy PGO in our `Adopt` tier is its native integration with **pgBackRest**. Unlike basic backup utilities that rely on `pg_dump` or naive file copies, pgBackRest provides:

- Page-level delta backups inspect database files at the 8KB page level, backing up only changed disk blocks to shrink backup windows.
- Multi-repository routing streams Write-Ahead Logs (WAL) and snapshots simultaneously to a fast local volume and a remote S3-compatible object store.
- Standby backups offload intensive routines from the primary database instance onto read replicas or the dedicated `repo-host` pod.
- Point-in-Time Recovery (PITR) enables deterministic rollbacks to an exact transaction timestamp with integrity validation.

### 2. High Availability Without Split-Brain

Crunchy PGO implements automated leader election using distributed consensus leases directly within Kubernetes. When a primary database node crashes or suffers a network partition:

1. The operator detects heartbeat loss without false-positive triggers during transient network blips.
2. The controller promotes the replica with the lowest replication lag.
3. The remaining standby instances automatically re-point to follow the new primary.

### 3. Integrated PgBouncer Connection Pooling

Database connections in PostgreSQL are process-based, consuming memory and CPU per active client. Crunchy PGO automates **PgBouncer** deployments natively as an isolated service layer. The operator manages credential rotation, TLS configuration, and connection pooling policies directly through the `PostgresCluster` manifest.

---

## Operational Trade-Offs

Operating Crunchy PGO comes with distinct operational friction points:

- PGO deploys dedicated repository pods (`repo-host`), sidecar containers for logging and metrics, and supplementary controller jobs, demanding idle RAM.
- The `PostgresCluster` specification is extensive, requiring dozens of nested YAML blocks that increase the learning curve for junior engineers.
- Crunchy Data separates advanced graphical dashboards and commercial support tiers behind enterprise channels.

---

## Verdict & Migration Guidance

- **Keep on Adopt:** High-throughput production workloads, databases with multi-terabyte datasets, and clusters requiring complex multi-destination backup topologies with pgBackRest.
- **Evaluating Alternatives:** Greenfield projects and modern GitOps pipelines prioritizing minimal pod overhead. Read our comparative evaluation: **[PostgreSQL on Kubernetes in 2026: Crunchy Data PGO vs. CloudNativePG](/blog/postgres-kubernetes-pgo-vs-cloudnativepg)**.
