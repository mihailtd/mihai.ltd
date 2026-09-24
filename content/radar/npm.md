---
title: "npm"
description: "Why npm was rejected for enterprise Node.js and TypeScript projects in favor of pnpm's content-addressable architecture and workspace isolation."
date: "2026-08-08"
type: "tech_report"
tags: ["npm", "pnpm", "nodejs", "typescript", "packaging", "tooling"]
placements:
  - category: "tools"
    subCategory: "js_tooling"
stage: "trial"
decision: "reject"
evaluatedScore: 3
decisionInFavorOf: "pnpm"
decisionReason: "Rejected in favor of pnpm for Node and TypeScript projects. Flat node_modules hoisting causes phantom dependencies, duplicated disk space waste across repositories, and slow CI installations without a content-addressable store."
decidedDate: "2026-08-08"
---

# npm: Why the Default Package Manager Was Rejected

As the default package manager distributed with Node.js, `npm` is universally known and ubiquitous across the JavaScript ecosystem. It established the registry standards that power the entire web ecosystem.

However, as applications scale in complexity—particularly in multi-package repositories and enterprise TypeScript codebases—`npm`'s architectural decisions create critical liabilities. On our Tech Radar, **`npm` is officially rejected in favor of [pnpm](/blog/pnpm)** (with **[Bun](/blog/bun)** evaluated for dedicated high-speed standalone services).

---

## 1. The Core Architectural Problem: Flat `node_modules` & Phantom Dependencies

To solve the nested directory length limits historically present in Windows, `npm v3` introduced **dependency hoisting**. Instead of nesting dependencies under each package, `npm` flattens dependencies into the top-level `node_modules/` directory.

While this prevented path-length errors, it introduced a far more insidious problem: **Phantom Dependencies**.

```text
# Flat npm node_modules structure:
node_modules/
├── my-package/          <-- Declared in your package.json
├── transitive-dep-a/    <-- NOT in your package.json, but hoisted to root!
└── transitive-dep-b/    <-- NOT in your package.json, but hoisted to root!
```

Because `transitive-dep-a` is hoisted into the root `node_modules`, Node's module resolution algorithm allows your code to execute:

```typescript
import { something } from "transitive-dep-a"; // Compiles and runs with npm!
```

Even though `transitive-dep-a` is **never declared** in your `package.json`!

### Why Phantom Dependencies Cause Production Outages

1. Tomorrow, `my-package` updates its internal implementation and removes its dependency on `transitive-dep-a`.
2. You run `npm update`.
3. Suddenly, your production build crashes with `Cannot find module 'transitive-dep-a'`.
4. Your application was secretly relying on an invisible dependency that you did not control or pin.

In contrast, **[pnpm](/blog/pnpm)** uses a **strict symlink layout**. Only packages explicitly declared in your `package.json` are placed in the root of `node_modules`. Phantom imports are caught immediately by the compiler and linter.

---

## 2. Disk Space Explosion: No Content-Addressable Storage

When you work on multiple projects or services using `npm`:

- If 15 projects each depend on `typescript`, `@types/node`, and `next` or `nuxt`, `npm` downloads and writes **15 identical physical copies** of those dependencies to your drive.
- A single frontend developer's machine easily accumulates 50GB–100GB of redundant `node_modules` junk.

**[pnpm](/blog/pnpm)** completely eliminates this waste using a **Global Content-Addressable Store (CAS)** (`~/.local/share/pnpm/store`):

- Every unique version of a file is stored **exactly once** on disk.
- Project `node_modules` directories are populated with **hard links** pointing to the global store.
- If 20 projects use the same Next.js version, it consumes disk space exactly once, and installing it into project #2 through #20 is nearly instantaneous.

---

## 3. Subpar Monorepo & Workspace Ergonomics

While `npm` added basic `workspaces` support in npm v7, it lacks the rigor required for enterprise **[Monorepos](/blog/monorepo)**:

1. **No `workspace:*` Protocol:** With `npm`, declaring internal package dependencies often requires manual version synchronization or confusing symlink behavior. [pnpm](/blog/pnpm) provides the explicit `workspace:*` or `workspace:^` protocol, ensuring internal packages resolve to local source code during development and transform to exact semantic versions during publish.
2. **Missing Advanced Filtering:** When operating in a monorepo with 25+ packages, you need to execute tasks against topological subsets:
   ```bash
   # pnpm allows surgical dependency tree execution:
   pnpm --filter @org/web... test   # Runs tests for @org/web and all its dependencies
   ```
   `npm`'s `--workspace` flag is flat and lacks dependency-graph awareness, requiring dedicated build orchestrators like **[Turborepo](/blog/turborepo)** or **[Moon](/blog/moon)** just to filter basic package chains.

---

## 4. Head-to-Head Comparison: npm vs. pnpm vs. Bun

| Feature                                | npm (Default)             | pnpm (Adopted Standard)                      | Bun (Alternative Runtime)     |
| :------------------------------------- | :------------------------ | :------------------------------------------- | :---------------------------- |
| **Status on Radar**                    | ❌ **Rejected**           | ✅ **Adopted**                               | ⚠️ **Trial**                  |
| **Node_modules Layout**                | Flat (Hoisted)            | Strict Symlinked Structure                   | Flat / Isolated binary cache  |
| **Phantom Dependencies**               | ⚠️ Vulnerable             | 🛡️ Immune                                    | ⚠️ Vulnerable (standard mode) |
| **Storage Architecture**               | Redundant copies per repo | Global Content-Addressable Store (Hardlinks) | Global module cache           |
| **Installation Speed (Cold)**          | Baseline (Slow)           | 2x – 3x faster                               | 10x – 20x faster              |
| **Installation Speed (Warm / Cached)** | Slow                      | Sub-second (Hardlink linking)                | Instantaneous                 |
| **Workspace Protocol (`workspace:*`)** | ❌ No                     | ✅ Native first-class support                | ✅ Supported                  |
| **Enterprise Monorepo Readiness**      | Basic                     | Industry Standard                            | Developing                    |

---

## 5. Migration: Moving from npm to pnpm

Transitioning an existing repository from `npm` to `pnpm` is straightforward and deterministic:

```bash
# 1. Install pnpm globally (or via corepack)
corepack enable
corepack prepare pnpm@latest --activate

# 2. Import existing package-lock.json to create pnpm-lock.yaml
pnpm import

# 3. Remove legacy artifacts
rm -rf node_modules package-lock.json

# 4. Install with strict symlink verification
pnpm install
```

If your project relied on hidden phantom dependencies, `pnpm install` or your TypeScript build will immediately surface the missing imports, allowing you to explicitly declare them in `package.json` where they belong.

---

## 6. Radar Verdict & Related Articles

`npm` remains essential as the public registry protocol and package registry backend. However, as an active CLI client and package manager, it has been completely superseded by superior tooling.

Explore our connected toolchain reports:

- **[pnpm (Adopted Standard)](/blog/pnpm):** How pnpm anchors our TypeScript and monorepo workflows.
- **[Bun (Trial)](/blog/bun):** Fast JavaScript runtime and high-speed package manager for edge services.
- **[Monorepo Architecture (Adopted)](/blog/monorepo):** Scalable code organization using native package workspaces.
- **[Turborepo](/blog/turborepo):** Task runner and computation cache built on top of pnpm workspaces.
- **[uv](/blog/uv):** The parallel revolution occurring in the Python ecosystem, replacing [pip](/blog/pip).
