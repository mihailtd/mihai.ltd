---
title: "Ruff"
description: "Python linter and formatter, adopted in favor of Black."
date: "2026-08-08"
type: "tech_report"
tags: ["ruff", "python", "formatting", "linting", "astral"]
placements:
  - category: "tools"
    subCategory: "python_tooling"
stage: "trial"
decision: "adopt"
evaluatedScore: 4
satisfaction: 5
decisionReason: "Adopted as formatter in favor of Black. Speed is the whole story here — a linter and formatter fast enough to stop noticing it runs at all."
decidedDate: "2026-08-08"
link: "https://docs.astral.sh/ruff/"
target: "_blank"
---

# Ruff

Lints and formats Python, replacing [Black](/blog/black) for formatting. Written in Rust, and it shows — the speed difference is not subtle.
