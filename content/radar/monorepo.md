---
title: "Monorepo"
description: "Single-repository architecture, adopted in favor of splitting services across multiple repos."
date: "2026-08-08"
type: "tech_report"
tags:
  [
    "monorepo",
    "architecture",
    "cicd",
    "devops",
    "tooling",
    "python",
    "typescript",
  ]
placements:
  - category: "techniques"
    subCategory: "architecture"
stage: "trial"
decision: "adopt"
evaluatedScore: 4
decisionReason: "Preferred mainly because independent deployment is still fully achievable through proper CI/CD, while a feature spanning multiple modules (say, two microservices and a UI) stays a single PR: easy to review, and deployed together without coordinating release order across repositories. Deployment is a CI/CD problem, not a code organization problem."
decidedDate: "2026-08-08"
---

# Monorepo Architecture: From Native Workspaces to Polyglot Build Systems

One repository for related services, libraries, and applications, rather than scattering them across a dozen disconnected repositories.

The most common objection to monorepos—_"How do we maintain independent deployability?"_—conflates code organization with artifact delivery. **Independent deployment is a CI/CD pipeline concern, not a repository layout problem.**

With path-based triggers, containerized builds, and targeted deployment pipelines, services in a monorepo deploy just as independently as polyrepo services. The difference is developer velocity: when a cross-cutting feature spans an API contract, two backend microservices, and a frontend client, it lives in a **single atomic Pull Request**. It is reviewed together, type-checked together, and merged without the fragile ceremony of semantic version bumping, registry publishing, and multi-repo deployment sequencing.

See also: [Polyrepo](/blog/polyrepo), the alternative this was weighed against.

---

## 1. The Foundation: Native Package Manager Workspaces

Before reaching for heavy monorepo build orchestrators, every modern monorepo starts with **native package manager workspaces**.

Workspaces solve the fundamental code-sharing problem: allowing internal packages to depend on one another locally via symlinks without publishing intermediate packages to npm or PyPI.

### pnpm Workspaces (TypeScript / Node.js)

In the JavaScript and TypeScript world, **[pnpm workspaces](/blog/pnpm)** (configured via `pnpm-workspace.yaml`) is our adopted foundation, replacing legacy **[npm](/blog/npm)**:

- **Strict symlink isolation:** Unlike **[npm](/blog/npm)** or Yarn classic which flatten `node_modules` and invite phantom dependency bugs, pnpm's content-addressable store creates strict, isolated symlinks.
- **Workspace protocol:** Using `"@org/shared-ui": "workspace:*"` ensures internal dependencies always link directly to local source code during development.
- **Recursive commands:** Commands like `pnpm --filter ./apps/web build` allow scoped execution across projects.

### uv Workspaces (Python)

Historically, Python was notoriously painful in monorepos. Legacy tools like **[pip](/blog/pip)** and requirements.txt (as well as Poetry and Pipenv) lacked native workspace semantics, forcing brittle `pip install -e .` hacks or complex path manipulation.

Astral's **[uv workspaces](/blog/uv)** changed the game completely:

- **Single unified lockfile:** A root `pyproject.toml` declares `[tool.uv.workspace]`, resolving a single, deterministic `uv.lock` across all microservices, shared libraries, and CLI tools.
- **Shared virtual environment:** Rather than creating 15 separate virtual environments that each re-download PyTorch, FastAPI, or Pandas, `uv` shares packages from its global cache and links internal packages instantly using `{ workspace = true }`.
- **Blazing performance:** Written in Rust, **[uv](/blog/uv)** resolves dependencies 10–100× faster than legacy **[pip](/blog/pip)**.

---

## 2. Workspaces vs. Full Monorepo Tooling: When to Transition?

A common architectural mistake is adopting heavy build orchestration tools too early—or waiting until CI pipelines grind to a halt before realizing native workspaces are not enough.

### What Native Workspaces Do Well:

- Local package linking and resolution.
- Dependency deduplication and unified lockfiles.
- Basic filtered command running (`pnpm --filter ...`, `uv run --package ...`).

### Where Native Workspaces Hit the Wall:

Native package managers have **no concept of build graphs or computation caching**. When you run `pnpm -r test` or `uv run pytest`, the package manager naively runs tests in every package—even if only a single markdown file changed.

::monorepo-transition-card
::

Dedicated monorepo engines ([Moon](/blog/moon), [Turborepo](/blog/turborepo), [Nx](/blog/nx)) introduce three transformative capabilities:

1. **Affected / Impact Analysis:** Using Git diffs and dependency graphs to execute tasks _only_ on packages affected by a commit.
2. **Computation Caching (Local & Remote):** Hashing file inputs, environment variables, and dependencies. If the hash hasn't changed, the tool restores build and test outputs from cache in milliseconds.
3. **Task Pipeline Parallelism:** Executing tasks topologically according to a defined graph (e.g. build shared UI before building web app, while running lint in parallel).

---

## 3. Homogeneous Stacks: Pure TypeScript vs. Pure Python

When your entire monorepo lives within a single language ecosystem, your tooling choice simplifies considerably.

### Scenario A: Pure TypeScript / JavaScript

- **Base:** `pnpm workspaces`
- **Orchestrator Choices:** **[Turborepo](/blog/turborepo)** vs. **[Nx](/blog/nx)**

For pure TypeScript/JavaScript monorepos (e.g., Next.js/Nuxt web apps, Node/Fastify microservices, shared UI components, shared TS schemas):

- **Turborepo** is the recommended default. It is lightweight, configuration-minimal (`turbo.json`), written in Rust, and focuses squarely on fast caching and task orchestration. It integrates seamlessly with Vercel and self-hosted remote caches without altering how your packages build.
- **Nx** is a heavier, enterprise-grade alternative. It provides deep AST analysis, project visualizers, and code generators. However, it introduces significant abstraction that can feel intrusive for teams wanting standard build scripts.

### Scenario B: Pure Python

- **Base:** `uv workspaces`
- **Tooling:** **`uv` + `ruff`**

For a pure Python monorepo (e.g., several FastAPI microservices, shared data models, and Celery workers):

- `uv workspaces` paired with `ruff` for linting and formatting is so ridiculously fast that **many Python teams do not even need a secondary monorepo build orchestrator**.
- Tests can be scoped via `uv run pytest --package service-a`, and dependency installation takes under 2 seconds.
- You only need a monorepo task runner in pure Python if you have heavy, multi-stage artifact builds (e.g. compiling Cython/C-extensions, generating PyInstaller binaries, or baking complex multi-stage Docker images in CI) where distributed remote caching pays dividends.

---

## 4. The Polyglot Challenge: Multi-Language Monorepos

The real trial begins when a monorepo combines different language runtimes: **Python backend services + TypeScript web applications + Rust/Go microservices or WASM modules**.

### Why JS-First Tools Struggle with Polyglot

Both Turborepo and Nx originated in the JavaScript/Node.js ecosystem:

- **Turborepo** expects `package.json` files everywhere. It does not understand Python virtual environments, Cargo workspaces, or Go modules natively. Attempting to shoehorn Python tasks into Turborepo requires wrapping everything in custom npm scripts.
- **Nx** supports Python through community plugins, but it can feel bolted on. Crucially, Nx assumes the developer’s local machine and CI runner already have the correct Python, Poetry, or Go versions installed and activated.

### Moon (`moonrepo`): The True Polyglot Architecture

This is where **[Moon](/blog/moon)** stands apart as the front-runner in our evaluation.

Moon was designed from day one as a language-agnostic, polyglot monorepo build system written in Rust:

1. **Hermetic Toolchain Management (`proto`):**
   Instead of assuming Node 20, Python 3.12, and Rust 1.80 are pre-installed on every developer's machine and CI container, Moon manages language runtimes natively via its toolchain system (`proto`). It automatically downloads, pins, and executes the exact runtime specified in `.moon/toolchain.yml`. No `nvm`, `pyenv`, or `rustup` configuration drift.
2. **First-Class Tier Support:**
   Moon treats JavaScript/TypeScript (`pnpm`), Python (`uv` / `pip`), Rust (`cargo`), and Go as first-class citizens. Tasks are declared declaratively in `moon.yml` files per project:
   ```yaml
   # apps/analytics-api/moon.yml (Python service)
   type: application
   language: python

   tasks:
     test:
       command: uv run pytest
       inputs:
         - "src/**/*"
         - "tests/**/*"

     lint:
       command: uv run ruff check .
   ```
3. **Cross-Language Dependency Graph:**
   Moon allows cross-language task dependencies. For example, a TypeScript frontend build task can declare a dependency on a Python OpenAPI schema generation task or a Rust WASM compilation task:
   ::monorepo-dag-chart
   ::
4. **Universal Unified CI:**
   Running `moon run :lint` or `moon run :test` runs the appropriate linter and test suite across TypeScript, Python, and Rust in topological order, parallelizing where possible and caching every output.

---

## 5. Architectural Decision Matrix

| Dimension                | `pnpm` / `uv` Workspaces                  | Turborepo                             | Nx                                    | Moon (`moonrepo`)                             |
| :----------------------- | :---------------------------------------- | :------------------------------------ | :------------------------------------ | :-------------------------------------------- |
| **Primary Scope**        | Package linking & lockfiles               | JS/TS Task Orchestrator               | Enterprise JS/TS Ecosystem            | Polyglot Repository Orchestrator              |
| **Language Support**     | Single language (JS or Python)            | JS / TS native (others via npm hacks) | JS / TS native (Python via plugins)   | **Node, Python, Rust, Go, Bun (Native)**      |
| **Toolchain Management** | None (host managed)                       | None (host managed)                   | None (host managed)                   | **Built-in hermetic toolchains (`proto`)**    |
| **Computation Caching**  | ❌ No                                     | ✅ Local & Remote (Vercel/S3)         | ✅ Local & Remote (Nx Cloud)          | ✅ Local & Remote (AWS/GCP/moonbase)          |
| **Affected Detection**   | ❌ No                                     | ✅ Git-based                          | ✅ Git + AST graph                    | ✅ Git-based                                  |
| **Config Overhead**      | Minimal (`package.json`/`pyproject.toml`) | Low (`turbo.json`)                    | Medium-High (`nx.json` + generators)  | Medium (`.moon/*.yml`)                        |
| **Best Fit For**         | Small or pure single-stack repos          | High-velocity pure TS/JS repos        | Large enterprise Angular/React setups | **Polyglot Python + TS + Rust architectures** |

---

## 6. Summary & Radar Verdict

- **Architecture Decision:** **Adopt Monorepo.** The developer experience of unified PRs, atomic cross-service refactors, and synchronized contracts far outweighs the multi-repo coordination overhead.
- **Phase 1 Foundation:** Always start with native workspaces—**`pnpm workspaces`** for TypeScript, **`uv workspaces`** for Python. Keep things simple until build times demand orchestration.
- **Phase 2 Scaling:**
  - If the repo remains **purely TypeScript**, adopt **[Turborepo](/blog/turborepo)** for zero-friction caching.
  - If the repo is a **polyglot hybrid (Python + TypeScript + Rust)**, **[Moon](/blog/moon)** is the clear front-runner, providing hermetic multi-runtime toolchains and true cross-language task pipelines.

---

## 7. Connected Deep Dives & Tech Reports

Explore the individual technology evaluations that form our monorepo web:

- **[Polyrepo (Rejected)](/blog/polyrepo):** Why multi-repo architectures failed our velocity tests and were rejected.
- **[pnpm (Adopted Standard)](/blog/pnpm):** Content-addressable package management and workspace linking for Node/TS.
- **[npm (Rejected)](/blog/npm):** Detailed analysis of phantom dependencies and flat node_modules liabilities.
- **[uv (Adopted Standard)](/blog/uv):** The high-speed Rust toolchain powering our Python workspaces.
- **[pip (Rejected)](/blog/pip):** Why pip and requirements.txt were retired in favor of uv.
- **[Turborepo (Adopted for TS)](/blog/turborepo):** Task orchestration and remote caching for pure TypeScript monorepos.
- **[Moon (Adopted for Polyglot)](/blog/moon):** Polyglot monorepo build system unifying Python, TypeScript, and Rust.
- **[Nx (Hold / Assess)](/blog/nx):** Enterprise-scale monorepo tool with deep AST code analysis and generators.
- **[Bun (Trial)](/blog/bun):** Fast JavaScript runtime, bundler, and package manager evaluated for edge services.
