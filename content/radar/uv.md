---
title: "uv"
description: "Python package and project manager, adopted in favor of pip."
date: "2026-08-08"
type: "tech_report"
tags: ["uv", "python", "packaging", "astral"]
placements:
  - category: "tools"
    subCategory: "python_tooling"
stage: "trial"
decision: "adopt"
evaluatedScore: 4
satisfaction: 5
decisionReason: "Always used instead of pip, with pyproject.toml and uv.lock. Fast, reliable dependency resolution and locking make it the default for every Python project now."
decidedDate: "2026-08-08"
link: "https://docs.astral.sh/uv/"
target: "_blank"
---

# uv

The default for Python packaging and project management: `pyproject.toml` for dependencies, `uv.lock` for reproducibility. Fast enough that it changes the workflow, not just the tool.
