---
title: "Building Evolutionary Architectures"
description: "A fresh perspective on software architecture, for anyone who wants to build systems that can evolve and adapt to changing requirements."
date: ""
type: "book_summary"
tags: ["software-architecture", "engineering"]
cover_image: "/images/book_covers/building-evolutionary-architectures.webp"
author: "Neal Ford, Rebecca Parsons, Patrick Kua"
isbn: ""
goodreads: ""
publisher: ""
publishedDate: ""
---

# Building Evolutionary Architectures

This book provides a fresh perspective on software architecture. It's a must-read for anyone who wants to build systems that can evolve and adapt to changing requirements.

## How it shaped my work

Fitness functions are the idea from this book I use most. An architecture rule only holds if something checks it automatically, so I try to turn every "we should never" into a test in CI.

In graphpg that became the pinned GraphQL SDL and OpenAPI files: CI fails when the generated schema drifts from what is committed. The same thinking runs through my articles on AI coding agents. An agent forgets a rule written in a prompt; it can't ignore a failing check. This book gave me the vocabulary for something I had been doing by instinct.
