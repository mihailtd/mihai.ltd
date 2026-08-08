---
title: "pnpm"
description: "Package manager for Node/TypeScript projects, adopted in favor of npm."
date: "2026-08-08"
type: "tech_report"
tags: ["pnpm", "nodejs", "typescript", "packaging"]
placements:
  - category: "tools"
    subCategory: "js_tooling"
stage: "trial"
decision: "adopt"
evaluatedScore: 4
decisionReason: "Adopted in favor of plain npm for Node and TypeScript projects. Faster installs and a content-addressable store that avoids duplicated dependencies across projects."
decidedDate: "2026-08-08"
link: "https://pnpm.io/"
target: "_blank"
---

# pnpm

The package manager for Node and TypeScript projects, in favor of [npm](/blog/npm). [Bun](/blog/bun) projects are the one exception — Bun ships and uses its own package manager.
