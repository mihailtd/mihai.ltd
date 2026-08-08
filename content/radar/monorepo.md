---
title: "Monorepo"
description: "Single-repository architecture, adopted in favor of splitting services across multiple repos."
date: "2026-08-08"
type: "tech_report"
tags: ["monorepo", "architecture", "cicd", "devops"]
placements:
  - category: "techniques"
    subCategory: "architecture"
stage: "trial"
decision: "adopt"
evaluatedScore: 4
decisionReason: "Preferred mainly because independent deployment is still fully achievable through proper CI/CD, while a feature spanning multiple modules (say, two microservices and a UI) stays a single PR: easy to review, and deployed together without coordinating release order across repositories. Deployment is a CI/CD problem, not a code organization problem."
decidedDate: "2026-08-08"
---

# Monorepo

One repository for related services and applications, rather than splitting them across many. Rejected the usual objection head-on: independent deployability does not require independent repositories — it requires a CI/CD pipeline capable of building, testing, and deploying each module on its own. Once that is in place, a monorepo just makes cross-module changes dramatically easier: a feature touching two microservices and a UI is one PR, reviewed and merged together, instead of a coordination dance across repos with pinned versions and ordered releases.

See also: [Polyrepo](/blog/polyrepo), the alternative this was weighed against.

The open question now is tooling, not architecture: a polyglot Python + Node.js monorepo outgrows what a package manager alone can coordinate (caching, parallel execution, cross-language task orchestration). [Moon](/blog/moon), [Nx](/blog/nx), and [Turborepo](/blog/turborepo) are all in trial to cover that gap.
