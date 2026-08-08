---
title: 'Docker Swarm'
description: 'Container orchestration tool, rejected in favor of Kubernetes.'
date: '2026-08-08'
type: 'tech_report'
tags: ['docker', 'swarm', 'orchestration']
placements:
  - category: 'platforms'
    subCategory: 'orchestration'
stage: 'assess'
decision: 'reject'
evaluatedScore: 1
decisionInFavorOf: 'kubernetes'
decisionReason: 'By the time a workload actually needs Swarm-level clustering, it is usually worth just going straight to Kubernetes instead.'
decidedDate: '2026-08-08'
---

# Docker Swarm

Considered as a lighter alternative to [Kubernetes](/blog/kubernetes) for container orchestration. Rejected — by the time the need for real clustering shows up, the extra investment in Kubernetes tends to pay off anyway, rather than settling for something in between.
