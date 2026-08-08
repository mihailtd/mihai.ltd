---
title: "npm"
description: "Default Node.js package manager, rejected in favor of pnpm."
date: "2026-08-08"
type: "tech_report"
tags: ["npm", "nodejs", "packaging"]
placements:
  - category: "tools"
    subCategory: "js_tooling"
stage: "trial"
decision: "reject"
evaluatedScore: 3
decisionInFavorOf: "pnpm"
decisionReason: "Rejected in favor of pnpm for Node and TypeScript projects. Never used as the primary package manager anymore."
decidedDate: "2026-08-08"
---

# npm

Rejected in favor of [pnpm](/blog/pnpm). Still ubiquitous as the underlying registry client, but not the package manager reached for directly.
