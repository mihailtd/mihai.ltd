---
title: 'Polyrepo'
description: 'Splitting services across multiple repositories, rejected in favor of a monorepo.'
date: '2026-08-08'
type: 'tech_report'
tags: ['polyrepo', 'multi-repo', 'architecture', 'cicd']
placements:
  - category: 'techniques'
    subCategory: 'architecture'
stage: 'trial'
decision: 'reject'
evaluatedScore: 3
decisionInFavorOf: 'monorepo'
decisionReason: 'Splitting related services and UI across repositories turns a single feature into multiple coordinated PRs, and forces ordering releases across repositories. A monorepo avoids that overhead entirely, since independent deployment is a CI/CD concern, not a repository-boundary concern.'
decidedDate: '2026-08-08'
---

# Polyrepo

One repository per service or application. Common default, and independent deployability is the usual argument for it — but that same independence is achievable inside a [Monorepo](/blog/monorepo) with a properly built CI/CD pipeline, without the cost of coordinating a change across repos whenever a feature spans more than one module.
