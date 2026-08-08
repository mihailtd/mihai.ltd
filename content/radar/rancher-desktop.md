---
title: "Rancher Desktop"
description: "Local Kubernetes and container runtime for development, adopted in favor of Docker Desktop."
date: "2026-08-08"
type: "tech_report"
tags: ["rancher", "kubernetes", "development", "containers"]
placements:
  - category: "tools"
    subCategory: "development"
stage: "trial"
decision: "adopt"
evaluatedScore: 4
decisionReason: "Adopted in favor of Docker Desktop. Rock solid and simple, with no update-related breakage or need to nuke and rebuild the local environment. It also focuses primarily on Kubernetes, which matters since Kubernetes is already an adopted technology here."
decidedDate: "2026-08-08"
---

# Rancher Desktop

Adopted in favor of [Docker Desktop](/blog/docker-desktop). Rock solid, simple, and focused mainly on Kubernetes — which matters since [Kubernetes](/blog/kubernetes) is already part of the adopted stack. No update-related breakage, no need to wipe containers and volumes and start over.

The local development split: [Docker Compose](/blog/docker-compose) covers simple, low-complexity multi-container setups. Rancher Desktop takes over as the local Kubernetes toolkit once a project's needs get more advanced and closer to production topology.
