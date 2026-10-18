---
title: "graphpg"
description: "In-house built high-performance Rust engine that derives unified GraphQL and REST APIs (OpenAPI 3.1) directly from PostgreSQL catalogs with single-statement execution and end-to-end type safety."
date: "2026-10-15"
type: "tech_report"
tags:
  [
    "graphpg",
    "postgresql",
    "graphql",
    "rest",
    "openapi",
    "rust",
    "databases",
    "apis",
    "ai-agents",
    "type-safety",
  ]
placements:
  - category: "tools"
    subCategory: "api_and_data"
  - category: "platforms"
    subCategory: "backend"
stage: "trial"
decision: "adopt"
evaluatedScore: 4
satisfaction: 5
decisionReason: "Built in-house to solve GraphQL and REST protocol drift. Derives both APIs from PostgreSQL catalogs into a single query execution plan with lateral joins and keyset pagination. Delivers end-to-end type safety for AI coding agents and eliminates hand-written data layers."
decidedDate: "2026-10-15"
link: "https://mihailtd.github.io/graphpg/"
target: "_blank"
cover_image: "/images/covers/radar-graphpg.png"
logoPath: "/images/tech/graphpg.svg"
---

# graphpg: Unified GraphQL and REST Engine for PostgreSQL

**[graphpg](https://mihailtd.github.io/graphpg/)** is an open-source, database-first API engine built in-house in Rust. It reads a PostgreSQL schema—tables, foreign keys, constraints, composite types, functions, and Row-Level Security policies—and serves a full **GraphQL API** and a **REST API** (with OpenAPI 3.1 specifications) from a single query planner.

We built and **Adopted** graphpg across our infrastructure after hitting the limits of running separate tools for GraphQL and REST. Maintaining two distinct data layers creates protocol drift: filter operators differ, error codes diverge, and connection limits apply inconsistently. graphpg eliminates this drift by planning both protocols onto one execution model where every request compiles into one SQL statement.

---

## Architectural Philosophy: One Engine, One Statement

Rather than implementing a GraphQL server in Node.js and a separate REST gateway in Haskell or Go, graphpg runs as a static Rust binary (`distroless/static`, ~27 MB) directly in front of PostgreSQL.

![graphpg Architecture: compile GraphQL and REST requests into single SQL statements with lateral joins and JSON aggregation](/images/blog/graphpg-architecture-poster.png)

### 1. Unified Operation Plan Across Both Protocols

In graphpg, a REST call such as `GET /rest/posts?filter[status][eq]=PUBLISHED&include=tags` and its equivalent GraphQL selection are two syntax projections of the exact same operation plan. They share:

- Keyset cursor pagination (`first` / `after` / `last` / `before`) and HTTP Range headers (`Range: items=0-19`).
- Deep filtering across relations (`some`, `every`, `none`, `count`), full-text, vector cosine scans (`pgvector`), and BM25 text search.
- Nested atomic writes (creating, connecting, updating, and syncing related records in a single transaction).
- Database-derived error codes (`EMAIL_TAKEN`, `AUTHOR_NOT_FOUND`).

### 2. Zero N+1 Queries: Single-Statement Execution

Nested relational selections in GraphQL frequently trigger N+1 queries in naive resolvers. graphpg compiles nested queries into SQL lateral joins and JSON aggregation. A query retrieving 20 posts with their respective authors, tags, and top comments executes as a single round trip to PostgreSQL.

In benchmark evaluations against PostgREST 16.4 on PostgreSQL 18.6, graphpg delivered 1.4x to 3x higher throughput on reads while enforcing strict depth, page-size, and cost limits on the plan before any SQL runs.

### 3. End-to-End Type Safety for AI Coding Agents

graphpg automatically exports `schema.graphql` (GraphQL SDL) and `openapi.json` (OpenAPI 3.1) during development. Code generators ([GraphQL Code Generator](https://the-guild.dev/graphql/codegen) and [openapi-typescript](https://openapi-ts.dev)) convert these contracts into TypeScript client types.

When an engineer or an AI coding agent executes a database migration (e.g., renaming a column in Drizzle), the contracts update immediately. The TypeScript compiler catches every outdated query across the codebase, turning an ambiguous refactoring task into a bounded list of compiler errors.

### 4. Enterprise Integrations Without In-Process Plugins

graphpg rejects arbitrary in-process plugins to preserve predictable single-statement execution and strict transaction rollback guarantees:

- **Computed Columns & Queries**: Declared directly as PostgreSQL functions (`STABLE` for queries, `VOLATILE` for mutations).
- **Asynchronous Side Effects**: Captured via event triggers within the database transaction and delivered as signed webhooks (Standard Webhooks format).
- **Federated Services**: Composed at the gateway as an [Apollo Federation v2](https://mihailtd.github.io/graphpg/docs/federation-and-rbac) subgraph.
- **External Data**: Linked across databases and Parquet files using PostgreSQL [Foreign Data Wrappers](https://mihailtd.github.io/graphpg/docs/foreign-data).

---

## Verdict & Usage

graphpg is our standard API engine for PostgreSQL-backed applications and AI agent workflows. We recommend it for:

- Projects requiring both GraphQL for frontend user interfaces and REST for external services and AI agents.
- Workflows where database migrations drive typed frontend and client contracts automatically.
- High-throughput services requiring sub-millisecond single-statement queries with zero resolver bloat.

### In-Depth Articles & Documentation

- Architectural Deep-Dive: **[Why GraphQL and REST Should Share One Engine: What I Learned Building graphpg](/blog/building-graphpg-graphql-and-rest-from-postgres)**
- Developer Guide: **[How End-to-End Type Safety Turns "Change It Everywhere" Into a List Your AI Agent Can Finish](/blog/end-to-end-type-safety-ai-coding-agents)**
- Official Website & Documentation: **[graphpg Documentation](https://mihailtd.github.io/graphpg/)**
- Open Source Repository: **[GitHub @mihailtd/graphpg](https://github.com/mihailtd/graphpg)**
