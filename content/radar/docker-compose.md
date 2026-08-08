---
title: "Docker Compose"
description: "Low-complexity local development setup, adopted for simple multi-container workflows."
date: "2026-08-08"
type: "tech_report"
tags: ["docker", "compose", "development"]
placements:
  - category: "tools"
    subCategory: "development"
stage: "trial"
decision: "adopt"
evaluatedScore: 4
decisionReason: "Adopted as the low-complexity entry point for local development: fast to set up for simple multi-container workflows, without reaching for a full local Kubernetes toolkit."
decidedDate: "2026-08-08"
---

# Docker Compose

The easy on-ramp for local development — define a few services in a YAML file and go. For more advanced local setups that need to mirror production more closely, [Rancher Desktop](/blog/rancher-desktop) and a local Kubernetes cluster take over.
