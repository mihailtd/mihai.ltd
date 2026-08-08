---
title: "JavaScript"
description: "Rejected as the primary authoring language, in favor of TypeScript."
date: "2026-08-08"
type: "tech_report"
tags: ["javascript", "typescript", "frontend", "backend"]
placements:
  - category: "languages_and_frameworks"
    subCategory: "front_end"
  - category: "languages_and_frameworks"
    subCategory: "back_end"
stage: "trial"
decision: "reject"
evaluatedScore: 4
decisionInFavorOf: "typescript"
decisionReason: "Rejected as the language actually written by hand, in favor of TypeScript, across both front-end and back-end work. JavaScript is still what everything compiles down to and runs as under the hood, so this is about the authoring language, not the runtime."
decidedDate: "2026-08-08"
---

# JavaScript

Still what everything ultimately runs as (Node, browsers, and bundlers all speak JavaScript), but no longer what gets written by hand. [TypeScript](/blog/typescript) is the authoring language now, front-end and back-end alike.
