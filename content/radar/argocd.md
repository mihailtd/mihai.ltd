---
title: 'ArgoCD'
description: 'GitOps continuous delivery tool for Kubernetes, adopted over Flux.'
date: '2026-08-08'
type: 'tech_report'
tags: ['argocd', 'gitops', 'kubernetes', 'cicd']
placements:
  - category: 'tools'
    subCategory: 'CI/CD'
stage: 'trial'
decision: 'adopt'
evaluatedScore: 4
satisfaction: 5
decisionReason: 'Adopted over Flux for GitOps delivery to Kubernetes. Full confidence after extended use, no reservations.'
decidedDate: '2026-08-08'
---

# ArgoCD

Declarative, Git-driven deployments to Kubernetes. Pairs naturally with a GitOps workflow. Considered alongside [Flux](/blog/flux) — Flux was not bad, but ArgoCD won out and has been rock solid ever since.
