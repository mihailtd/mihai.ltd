---
title: "Why GraphQL and REST Should Share One Engine: What I Learned Building graphpg"
description: "What PostGraphile, Hasura and PostgREST got right, what I did differently in graphpg (one Rust engine for GraphQL and REST, one SQL statement per request, no plugins), and why the two APIs should come from one plan instead of competing."
date: "2026-10-15"
type: "blog_post"
tags: ["postgres", "graphql", "rust", "api"]
cover_image: "/images/covers/building-graphpg-graphql-and-rest-from-postgres.png"
---

# Why GraphQL and REST Should Share One Engine: What I Learned Building graphpg

_GraphQL or REST is the wrong question for many teams. You often end up running both, and what matters is whether they come from one place or drift apart._

I build a lot of applications on PostgreSQL, and for years I have reached for tools that read the database and serve an API from it, instead of writing a data layer by hand. The largest schema I work with is a FHIR R5 data model (FHIR is the HL7 standard for exchanging healthcare records): 177 tables, composite types, JSON views and recursive functions. That schema is where [graphpg](https://mihailtd.github.io/graphpg/) started.

We built graphpg in-house as an open-source Rust engine (and adopted it on our [technology radar](/blog/graphpg)). It reads a PostgreSQL schema and serves a GraphQL API and a REST API from it, with an OpenAPI 3.1 document describing the REST side. This article covers what I took from the tools that came before it, what I did differently, and why I think GraphQL and REST should be generated from one engine rather than picked between.

---

## What the database-first tools got right

None of the ideas below are mine. Each comes from a tool I used and still respect.

**[PostGraphile](https://postgraphile.org): the database is the schema.** Tables, foreign keys, functions and comments become a GraphQL schema with no resolver code. Authorization stays in PostgreSQL, through Row-Level Security (RLS, policies that filter which rows a role can see) driven by settings from the request. Version 5's Grafast planner made it fast as well as elegant. graphpg's integration tests still use a forum schema and queries adapted from PostGraphile's own test suite. "Does it answer like PostGraphile does?" was the first bar I wanted to clear.

**[Hasura](https://hasura.io): the operational pieces.** Event triggers (webhooks fired when rows change), allow-lists of operations, depth and node limits, a console. Hasura showed that a generated API needs production features around it, not only a schema.

**[PostgREST](https://postgrest.org): one statement per request.** PostgREST's design principle is that "the structural constraints and permissions in the database determine the API endpoints and operations", and every request runs as one SQL statement in one transaction. It has done this in production since 2014, and its HTTP surface is still broader than graphpg's.

---

## What I did differently

![One engine: GraphQL and REST requests share one operation plan, compiled into one SQL statement against PostgreSQL, whose catalog defines the schema](/images/blog/one-engine-poster.png)

### 1. One engine behind both APIs

GraphQL and REST in graphpg are two front ends to the same operation plan. A REST call such as `GET /rest/posts?filter[status][eq]=PUBLISHED&include=tags` and the equivalent GraphQL query become the same plan, so they share filters, ordering, keyset pagination, nested writes, safety limits, authorization and error codes. Add a filter operator and both APIs get it.

The two APIs aren't identical, and shouldn't be: some things only make sense in one of them. The [parity document](https://mihailtd.github.io/graphpg/docs/graphql-openapi-parity) lists where they differ and why. Put two separate tools in front of one database, say PostGraphile for GraphQL and PostgREST for REST, and the differences stop being choices. One supports a filter the other lacks, an error comes back in a different shape, a limit holds on one side only.

### 2. Every request is one SQL statement

A nested GraphQL selection compiles to lateral joins and JSON aggregation, so a query for twenty posts with their authors and comments is one round trip, never one query per post (the N+1 problem). Connections page by keyset (`WHERE (created_at, id) < (…)`), an index seek on every page. Limits on page size, depth and cost are checked on the plan before any SQL runs.

Against PostgREST on the same database ([benchmark scripts](https://github.com/mihailtd/graphpg/tree/main/benchmarks/rest)), reads ran at 1.4 to 3 times the throughput. Deep `offset` pagination came out about even, bulk updates by filter 2% behind, and single-row writes 1.1 to 1.4 times ahead:

![Requests per second, graphpg against PostgREST: single row by key 74,031 against 24,606; keyset pagination 35,040 against 22,077; list of 20 rows 33,426 against 21,282; filtered list 32,501 against 19,894; 20 posts with author and comments 17,227 against 11,995 | wide](/images/blog/benchmark-throughput.png)

Treat that as one data point, not a ranking. Throughput depends far more on your schema, indexes and hardware than on the server, so run the benchmark on yours.

### 3. No plugins, no custom resolvers

This is the decision people question most. PostGraphile has a plugin system; Hasura has actions and remote schemas. graphpg has neither, on purpose ([decision record](https://mihailtd.github.io/graphpg/docs/extending)).

A resolver running inside the server sits outside the statement. It adds a round trip per row unless it batches, it runs outside the transaction and outside RLS, and the limits checked on the plan no longer cover the request. A plugin runtime is also a product of its own, with an API to keep stable through every upgrade.

Behavior goes where it keeps those guarantees instead:

- A computed field is a SQL function that takes the row: `posts_excerpt(p posts)` becomes `Post.excerpt`.
- A custom query or mutation is a SQL function (`STABLE` ones become queries, `VOLATILE` ones mutations).
- Side effects go to event triggers, recorded in the change's own transaction and delivered as signed webhooks.
- Logic that cannot live in SQL goes in a service of your own, composed at the gateway with Apollo Federation.

The trade-off is real. If you want to rewrite how the schema is generated, PostGraphile is the better tool.

### 4. The contract is a file, and drift is an error

graphpg writes the GraphQL SDL and the OpenAPI document to files you commit. `graphpg schema export --check` fails CI when they are out of date, and production refuses to start on a database that does not match them. Constraint violations come back as codes derived from the constraint (`EMAIL_TAKEN`, `AUTHOR_NOT_FOUND`), listed in both documents.

This is the piece that matters most for type safety, which I wrote about separately in [How End-to-End Type Safety Turns "Change It Everywhere" Into a List Your AI Agent Can Finish](/blog/end-to-end-type-safety-ai-coding-agents).

### 5. A single binary, close to PostgreSQL's newest features

graphpg ships as a single static binary in a small container image with no shell. It reads PostgreSQL 17 and 18 features into the schema without hand-written SQL: temporal keys (`WITHOUT OVERLAPS`), `RETURNING OLD`, `JSON_TABLE` views, `NOT ENFORCED` constraints.

---

## Why GraphQL and REST need to coexist

The GraphQL-or-REST debate assumes you pick one. In the projects I have worked on, teams end up with both, because each is better at a different job.

**GraphQL is better for user interfaces.** A screen asks for exactly the fields it renders, across relations, in one round trip. The schema is typed and introspectable, so a client generator produces the exact result type of every query. When the UI changes, the query changes with it, and the server does not need a new endpoint.

**REST is better at the edges of the system.** HTTP caching with `ETag`s, a `curl` command in a runbook, webhooks, CSV and NDJSON exports, partners who expect plain HTTP, services written in languages with weak GraphQL tooling. And now AI agents: many agent frameworks build their tools directly from an OpenAPI document, and a REST call with typed parameters maps neatly onto a tool call.

Running both is fine. Running two implementations of the same rules is what hurts: a GraphQL server with one idea of what "published" means and a REST layer with another, or a field hidden from one API and readable through the other. When both APIs come from one plan, coexisting is cheap. You get the GraphQL schema for the app and the OpenAPI document for everything else, and both answer to the same constraints and policies.

---

## How I built it

Close to half of graphpg's code is integration tests that run against a real PostgreSQL. That matters more than usual for a tool that generates an API from someone else's schema.

I wrote most of it with AI coding agents. That only worked because of the same discipline the tool itself encourages. The tests define what "done" means, the compiler rejects most mistakes before they run, and every change is small enough to review. When the agents got something wrong, a failing test caught it in the same session in most cases, not me a week later.

The FHIR schema did the exploratory testing. A crawler and a fuzzer sent requests at everything the 177-table schema exposes and found real bugs, in claim handling, concurrent schema changes and failover between replicas. Those fixes went into the first stable release.

---

## Where graphpg fits, and where it does not

graphpg fits when you want one service you configure rather than program, your authorization already lives in PostgreSQL (roles, grants, RLS), and you want GraphQL and REST to agree because both compile from one plan. It also fits distributed architectures: you can join remote databases and Parquet files through [foreign data wrappers](https://mihailtd.github.io/graphpg/docs/foreign-data), or compose graphpg as a subgraph with other services at the gateway using [Apollo Federation](https://mihailtd.github.io/graphpg/docs/federation-and-rbac).

Something else fits better when:

- **You want an admin console** to design tables and metadata by clicking: Hasura Console or Supabase Studio. In graphpg, schema changes are SQL migrations and API settings live in `graphpg.yaml`.
- **You want plugins that change how the schema is generated**: PostGraphile. graphpg moves custom logic into SQL functions, event triggers or separate services, to keep one statement per request.
- **You need to stream every change as an event**: Hasura streaming subscriptions. graphpg's subscriptions send the latest result when data changes, and its event triggers deliver webhooks.

The [comparison page](https://mihailtd.github.io/graphpg/docs/comparison) on the graphpg documentation website lists each feature in detail, including where the other tools are broader.

---

## Key takeaways

- **Many teams end up running GraphQL and REST, and two implementations of the same rules drift apart.** Solution: generate both from one plan, so they share filters, limits, errors and authorization.
- **A generated API is only as fast as the round trips it makes.** Solution: compile each request into one SQL statement with lateral joins and keyset pagination, and check limits on the plan before running it.
- **Plugins and custom resolvers break the guarantees that make a generated API safe.** Solution: put behavior in SQL functions, constraints, policies and event triggers, and compose anything else at the gateway.
- **An API contract that is not checked in CI will drift.** Solution: commit the SDL and OpenAPI document, fail CI on drift, and refuse to start in production on a mismatched schema.

graphpg is open source under MIT or Apache-2.0. Explore the [official documentation website](https://mihailtd.github.io/graphpg/) for guides on [AI agents](https://mihailtd.github.io/graphpg/docs/ai-agents), [type safety](https://mihailtd.github.io/graphpg/docs/type-safety), and a Docker quick start. The source code is available on [GitHub](https://github.com/mihailtd/graphpg).
