---
title: "Learning Helm"
description: ""
date: ""
type: "book_summary"
tags: ["kubernetes", "helm"]
cover_image: "/images/book_covers/learning-helm-cover.jpg"
author: ""
isbn: ""
goodreads: ""
publisher: ""
publishedDate: ""
---

# Learning Helm

A practical guide to packaging, configuring and releasing applications on Kubernetes with Helm charts.

## How it shaped my work

I picked this up when my homelab moved from Docker Compose to K3s and my YAML started copying itself across folders. The chapters on chart structure and values made me stop treating Helm as an installer and start treating charts as an interface: a small set of values a user should change, and sensible defaults for everything else.

That shows up in how I deploy n8n in queue mode and the rest of my cluster. I keep my own values files short, read the upstream chart before overriding it, and template only what actually differs between environments.
