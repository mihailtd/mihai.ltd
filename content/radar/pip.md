---
title: "pip"
description: "Python package installer, rejected in favor of uv."
date: "2026-08-08"
type: "tech_report"
tags: ["pip", "python", "packaging"]
placements:
  - category: "tools"
    subCategory: "python_tooling"
stage: "trial"
decision: "reject"
evaluatedScore: 4
decisionInFavorOf: "uv"
decisionReason: "Rejected, along with requirements.txt, in favor of uv with pyproject.toml and uv.lock. Not up for debate at this point."
decidedDate: "2026-08-08"
---

# pip

Rejected in favor of [uv](/blog/uv). No more `requirements.txt` — dependencies live in `pyproject.toml`, locked with `uv.lock`.
