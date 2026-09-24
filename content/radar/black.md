---
title: "Black"
description: "The uncompromising Python code formatter that eliminated style debates, now superseded and rejected in favor of Ruff."
date: "2026-08-08"
type: "tech_report"
tags: ["black", "python", "formatting", "pep8", "code-quality", "legacy"]
placements:
  - category: "tools"
    subCategory: "python_tooling"
stage: "trial"
decision: "reject"
evaluatedScore: 4
satisfaction: 3
decisionInFavorOf: "ruff"
decisionReason: "Replaced by Ruff. While Black revolutionized Python development by ending stylistic bikeshedding, Ruff format achieves 99.9% style parity with 30-100x faster execution while consolidating isort, Flake8, and pyupgrade into a single native binary."
decidedDate: "2026-08-08"
link: "https://black.readthedocs.io/"
target: "_blank"
---

# Black: The Uncompromising Formatter That Changed Python (and Why We Moved to Ruff)

Few open-source developer tools have exerted as profound a cultural impact on modern software engineering as **Black**. Created by Łukasz Langa in 2018 under the Python Software Foundation (PSF), Black fundamentally transformed the Python ecosystem by solving one of the most persistent drains on developer productivity: **stylistic bikeshedding**.

Borrowing Henry Ford's famous philosophy (_"Any customer can have a car painted any colour that he wants so long as it is black"_), Black introduced deterministic, zero-config formatting to a community that had spent years arguing over single versus double quotes, dangling brackets, and multi-line parameter indents.

For years, Black was an indispensable pillar of our Python toolchain. However, as codebases grew and developer experience demands accelerated, Black's architectural foundation revealed insurmountable performance ceilings. Today, we have placed Black on **Hold** and transitioned our entire engineering organization to **[Ruff](/blog/ruff)**.

---

## The Historical Triumph of Black

Before Black, code reviews in enterprise Python teams routinely stalled over trivial aesthetic choices. Linters like Flake8 would complain about PEP 8 violations (such as `E501` line length or `E128` indentation), but developers were left to manually format the code to satisfy the linter.

Black flipped this dynamic on its head through three core innovations:

1. **Deterministic Output**: Regardless of the original formatting, Black produces the exact same AST representation every single time. It eliminated formatting discussions from pull request reviews entirely.
2. **AST Safety Verification**: Before writing formatted code to disk, Black parses both the original code and the formatted output into an Abstract Syntax Tree (AST) and confirms that they are syntactically and semantically identical. If the AST changed, Black refused to write the file, guaranteeing that formatting could never introduce logic regressions.
3. **Opinionated Pragmatism**: By setting a standard line length of 88 characters (rather than PEP 8's strict 79 characters) and standardizing on double quotes (which reduces escaping in string literals containing apostrophes), Black established a modern visual identity for Python.

---

## Why Black Fell Behind: The Architectural Bottleneck

Despite its cultural success, Black was constrained by the very runtime it sought to format: **CPython**.

### 1. The Overhead of the Python Runtime

Because Black is written entirely in Python, running `black .` incurs the full overhead of spinning up the Python virtual machine, importing dozens of modules, and executing dynamic bytecode. For small utility scripts, this latency is tolerable (~300ms–800ms). But in enterprise monorepos containing hundreds of thousands of lines of Python across hundreds of files, Black routinely requires **3 to 10 seconds** to format the codebase.

### 2. Multi-Pass AST Double-Checking Under the GIL

To enforce its strict safety invariant, Black parses each file into an AST twice. Under Python's Global Interpreter Lock (GIL), multi-threading provides limited relief. While Black supports process-based multiprocessing (`--workers`), process spawning on macOS and Linux introduces substantial memory and inter-process communication (IPC) overhead.

### 3. The Multi-Tool Fragmentation Dilemma

Formatting was only one piece of the code quality puzzle. In production, Black could not operate in isolation:

- You still needed **isort** to sort imports (and configure isort with `profile = "black"` to avoid conflicting edits).
- You still needed **Flake8** to check for undefined variables and syntax bugs (and explicitly ignore rules like `E203` and `W503` because Black formatted slices in ways Flake8 disapproved of).
- You still needed **pyupgrade** to modernize syntax and **autoflake** to purge dead imports.

This fragmented stack meant CI jobs had to sequentially install, cache, and execute 4 to 6 separate Python CLI utilities, dragging down deployment velocity.

---

## Why We Migrated to Ruff

The release of `ruff format` by **Astral** delivered the exact architectural breakthrough the Python ecosystem needed.

| Dimension                        | Black (Legacy Standard)          | Ruff Formatter (Adopted)                           |
| :------------------------------- | :------------------------------- | :------------------------------------------------- |
| **Implementation Language**      | Pure Python (CPython)            | Native Rust                                        |
| **Execution Latency (150k LOC)** | ~2,500ms – 4,500ms               | **~25ms – 50ms (50x–100x faster)**                 |
| **Pre-commit Feedback Loop**     | 3 to 8 seconds                   | **Imperceptible (<100ms)**                         |
| **Import Sorting**               | Requires separate `isort`        | **Native built-in (`select = ["I"]`)**             |
| **Linting & Bug Detection**      | None (formatting only)           | **Native built-in (replaces Flake8)**              |
| **Configuration Complexity**     | Fragmented across multiple files | **Single `[tool.ruff]` block in `pyproject.toml`** |
| **AST Formatting Parity**        | The Reference Standard           | **99.9% Parity with Black output**                 |

### Zero Formatting Diff Noise

The primary anxiety when replacing a formatter across a production codebase is git history pollution—generating massive diffs that break `git blame` across hundreds of files.

Astral explicitly engineered `ruff format` to be a **drop-in visual clone of Black**. When we ran `ruff format` against our existing Black-formatted repositories, over 99.9% of files produced zero diff changes. The small remaining differences were minor edge cases where Ruff adhered even more faithfully to PEP 8 line-breaking guidelines.

---

## Migration Guide: Moving from Black to Ruff in 3 Steps

Migrating from Black to Ruff is straightforward and can be accomplished in minutes.

### Step 1: Remove Black and isort from Dependencies

With **[uv](/blog/uv)**, remove Black and isort:

```bash
uv remove black isort flake8
uv add --dev ruff
```

### Step 2: Update `pyproject.toml`

Replace existing `[tool.black]` and `[tool.isort]` sections with unified Ruff configuration:

```toml
# Old config (DELETE):
# [tool.black]
# line-length = 88
# target-version = ['py312']
#
# [tool.isort]
# profile = "black"

# New unified config (ADD):
[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
line-ending = "lf"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP"]
```

### Step 3: Update Git Pre-Commit Hook

In `.pre-commit-config.yaml`, replace the Black hook with Ruff:

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.9.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

---

## Architectural Verdict & Retrospective

| Status                   | Details                                             |
| :----------------------- | :-------------------------------------------------- |
| **Current Stage**        | **Hold / Rejected**                                 |
| **Decision in Favor Of** | **[Ruff](/blog/ruff)**                              |
| **Historical Grade**     | **A+ (Revolutionary for Python developer culture)** |
| **Modern Viability**     | **C (Superseded by native Rust execution)**         |

### Final Retrospective

Black deserves immense credit: it permanently freed Python engineers from stylistic bikeshedding and established deterministic formatting as an industry baseline.

However, modern software engineering cannot afford the latency of interpreted Python tooling in critical path developer loops. By adopting **[Ruff](/blog/ruff)** alongside **[uv](/blog/uv)** and **[ty](/blog/ty)**, we retain Black's elegant, uncompromising aesthetic standards while gaining a 100x execution speedup and a completely unified toolchain.
