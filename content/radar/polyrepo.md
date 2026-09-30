---
title: "Polyrepo"
seoTitle: "Polyrepo vs Monorepo: Why I Rejected the Multi-Repository Pattern | Mihai Farcas"
headline: "Polyrepo Architecture: Why I Rejected the Multi-Repository Pattern"
description: "Splitting microservices across independent repositories: why multi-repo architecture was rejected in favor of an orchestrated monorepo."
date: "2026-08-08"
updated: "2026-09-30"
type: "tech_report"
tags: ["polyrepo", "multi-repo", "architecture", "cicd", "devops", "monorepo"]
placements:
  - category: "techniques"
    subCategory: "architecture"
stage: "trial"
decision: "reject"
evaluatedScore: 3
decisionInFavorOf: "monorepo"
decisionReason: "Splitting related services and UI across repositories turns a single feature into multiple coordinated PRs, creates dependency drift, and forces ordering releases across repositories. A monorepo avoids that overhead entirely, since independent deployment is a CI/CD pipeline capability, not a repository boundary concern."
decidedDate: "2026-08-08"
---

In modern software engineering, repository architecture is frequently conflated with system deployment architecture. The classic convention—one Git repository per service or microservice—is commonly known as the **Polyrepo (or Multi-Repo)** pattern.

While the polyrepo model is often the instinctive default for teams embracing microservices, real-world operational friction reveals severe systemic costs as systems grow. **Short answer: for related services owned by the same organization, use a monorepo, not a polyrepo.** On my Tech Radar, **polyrepo is rejected in favor of an orchestrated [Monorepo](/blog/monorepo)** — independent deployment is a CI/CD concern, not a reason to split repositories.

---

## 1. The Core Promise vs. The Real-World Reality

Polyrepos promise team autonomy and isolation; in practice they multiply the work of every change that crosses a service boundary.

The traditional argument for polyrepos sounds compelling on paper:

- **Isolated Code Ownership:** Teams have full autonomy over their individual service repositories.
- **Lean Git Clones:** Developers only pull the specific codebase they actively maintain.
- **Independent CI/CD:** Changing service A does not trigger tests or deployment builds for service B.

However, in fast-moving engineering environments where microservices frequently communicate over APIs, events, or shared domain contracts, this clean separation quickly deteriorates into what industry architects call a **distributed monolith with multi-repo coordination tax**.

---

## 2. The 5 Multi-Repo Taxes That Break Velocity

The five recurring costs of polyrepos are: one feature split across several synchronized pull requests, dependency and version drift between repos, API contract breakage discovered at runtime instead of compile time, duplicated and drifting CI/CD pipelines, and harder code discovery and cross-team refactoring.

When your software spans multiple repositories, simple changes become tedious cross-organizational projects. I identified five fatal friction points during my evaluation:

### 1. The Synchronized PR Tax (Atomic Commits are Impossible)

When a backend service updates an API endpoint and the frontend web client must consume it:

- In a **Polyrepo**, you must create PR #1 in the backend repo, merge it, release or tag a new version, wait for package publication, update dependencies in the frontend repo with PR #2, and carefully synchronize the staging rollout.
- If a bug is caught during staging, rolling back requires orchestrating coordinated reverts across multiple Git histories.
- In a **[Monorepo](/blog/monorepo)**, this is a **single atomic PR**: the backend schema change and frontend consumer update live in the exact same commit, reviewed and verified together.

### 2. Dependency Drift and Version Chaos

In a polyrepo setup, shared logic (such as logging formats, auth middlewares, or TypeScript interfaces) must be packaged and published to a private registry (like [npm](/blog/npm) or PyPI).
Inevitably:

- Service A runs on v2.1.0 of the internal auth library.
- Service B runs on v2.4.3.
- Service C is stranded on v1.8.0 with known security vulnerabilities.
  Keeping 20+ independent repositories updated with shared library releases requires automated bots, endless dependency-bump PRs, and constant review fatigue. In contrast, tools like **[pnpm](/blog/pnpm)** workspaces and **[uv](/blog/uv)** workspaces link shared libraries directly from source via `workspace:*` links.

### 3. Contract Breakage at Runtime Rather Than Compile Time

When contracts change in a polyrepo, integration testing between services usually happens late in the lifecycle (staging or end-to-end test clusters). With unified task orchestrators like **[Moon](/blog/moon)** or **[Turborepo](/blog/turborepo)**, cross-service schema generators and typecheckers run immediately on pre-commit and PR builds, catching breaking changes before code ever merges.

### 4. CI/CD Duplication and Drift

Every polyrepo maintains its own `.github/workflows/`, Dockerfiles, lint configs, and deployment scripts. When modernizing security scanners or updating Node/Python versions, engineers must duplicate the change across 30+ repositories.

### 5. Hindered Code Discovery and Cross-Team Refactoring

Polyrepos create organizational silos. Searching for how an internal API is consumed requires searching across dozen of separate repositories. Automated refactoring tools (AST codemods, language server renames) cannot operate across Git boundaries.

---

## 3. The Deployment Fallacy: Independent Deployment Does Not Require Independent Repos

Services in a monorepo can still deploy independently: path-based CI triggers and per-service pipelines build and release only what changed, so repository layout and deployment granularity are separate decisions.

The most frequent misconception cited by polyrepo proponents is:

> _"We need separate repositories so we can deploy our microservices independently."_

**Independent deployability is a CI/CD pipeline capability, not a repository organization boundary.**

Modern monorepo build systems ([Moon](/blog/moon), [Turborepo](/blog/turborepo), and [Nx](/blog/nx)) utilize **Affected Change Analysis** based on Git diffs and dependency graphs. When an engineer commits changes to `apps/billing-service`:

1. The CI pipeline analyzes the dependency tree.
2. Only `apps/billing-service` and its direct dependents are tested and built.
3. Only `apps/billing-service` is deployed to production.
4. All unrelated services are skipped entirely, saving minutes of CI runtime through local and remote computation caching.

You achieve 100% independent deployments while retaining all the developer experience advantages of a single codebase.

---

## 4. Architectural Comparison: Polyrepo vs. Monorepo

A monorepo wins on atomic changes, shared tooling and refactoring; a polyrepo wins only on hard access isolation and fully independent ownership.

| Evaluation Dimension             | Polyrepo (Multi-Repo)                        | Monorepo (Orchestrated)                                              |
| :------------------------------- | :------------------------------------------- | :------------------------------------------------------------------- |
| **Atomic Cross-Service Changes** | ❌ Impossible (Requires sequenced PRs)       | ✅ Native (Single commit, single review)                             |
| **Shared Library Management**    | ⚠️ High friction (Private registry releases) | ✅ Zero overhead ([pnpm](/blog/pnpm) / [uv](/blog/uv) workspaces)    |
| **Refactoring & Discovery**      | ❌ Siloed across multiple Git URLs           | ✅ Instant global search and codemods                                |
| **CI/CD Maintenance**            | ⚠️ Duplicated across dozens of repos         | ✅ Centralized, unified pipelines                                    |
| **Toolchain Consistency**        | ❌ Version drift between teams               | ✅ Guaranteed hermetic runtimes ([Moon](/blog/moon))                 |
| **Git Clone Size**               | ✅ Small per repo                            | ⚠️ Larger initial clone (mitigated by shallow clone/sparse checkout) |
| **Access Control Granularity**   | ✅ Native per-repo GitHub permissions        | ⚠️ Requires CODEOWNERS or branch protections                         |

---

## 5. When Does Polyrepo Still Make Sense?

Separate repositories still make sense for genuinely independent products, open-source packages with their own release cycle, strict legal or security isolation, and code owned by different organizations.

While I reject polyrepo for core product and infrastructure systems, there are specific scenarios where multi-repo separation remains legitimate:

1. **Hard Organizational or Security Firewalls:** Regulated financial systems or sensitive data modules that cannot be accessible to general engineering staff even in read-only mode.
2. **Third-Party Open-Source Packages:** Standalone libraries published to the broader community that follow independent semantic versioning lifecycles and independent contributor communities.
3. **Completely Unrelated Products:** Systems that share zero business logic, zero domain types, zero infrastructure, and zero team collaboration.

For any set of applications, microservices, and client apps that cooperate to deliver a cohesive product, a **[Monorepo](/blog/monorepo)** is unequivocally the superior architectural choice.

---

## 6. Related Architecture Reports & Tooling

These reports cover the tooling that makes the monorepo alternative work.

To explore the tooling I selected to make the monorepo architecture thrive:

- **[Monorepo Architecture (Adopted)](/blog/monorepo):** Complete strategy breakdown from native workspaces to task orchestration.
- **[pnpm](/blog/pnpm):** The disk-efficient package manager powering TypeScript workspaces over [npm](/blog/npm).
- **[uv](/blog/uv):** The high-speed Astral tool powering Python workspaces over [pip](/blog/pip).
- **[Moon](/blog/moon):** The polyglot orchestrator unifying Python, TypeScript, and Rust task graphs.
- **[Turborepo](/blog/turborepo):** High-velocity remote caching for JavaScript/TypeScript repositories.
