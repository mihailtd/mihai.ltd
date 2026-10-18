---
title: "Why GraphQL and REST Should Share One Engine: What I Learned Building graphpg"
description: "What PostGraphile, Hasura and PostgREST got right, what I did differently in graphpg (one Rust engine for GraphQL and REST, one SQL statement per request, no plugins), and why the two APIs should come from one plan instead of competing."
date: "2026-10-15"
type: "blog_post"
tags: ["postgres", "graphql", "rust", "api"]
cover_image: "/images/covers/building-graphpg-graphql-and-rest-from-postgres.png"
---

# Why GraphQL and REST Should Share One Engine: What I Learned Building graphpg

_GraphQL or REST is the wrong question for most teams. You end up running both, and what matters is whether they come from one place or drift apart._

I build a lot of applications on PostgreSQL, and for years I have reached for tools that read the database and serve an API from it, instead of writing a data layer by hand. The largest schema I work with is a FHIR R5 data model (FHIR is the HL7 standard for exchanging healthcare records): 177 tables, composite types, JSON views and recursive functions. That schema is where graphpg started.

graphpg is a single Rust binary that reads a PostgreSQL schema and serves a GraphQL API and a REST API from it, with an OpenAPI 3.1 document describing the REST side. This article covers what I took from the tools that came before it, what I did differently, and why I think GraphQL and REST should be generated from one engine rather than picked between.

---

## What the database-first tools got right

None of the ideas below are mine. Each comes from a tool I used and still respect.

**[PostGraphile](https://postgraphile.org): the database is the schema.** Tables, foreign keys, functions and comments become a GraphQL schema with no resolver code. Authorization stays in PostgreSQL, through Row-Level Security (RLS, policies that filter which rows a role can see) driven by settings from the request. Version 5's Grafast planner made it fast as well as elegant. graphpg's integration tests still use a forum schema and queries adapted from PostGraphile's own test suite (MIT licensed, credited in the repository). "Does it answer like PostGraphile does?" was the first bar I wanted to clear.

**[Hasura](https://hasura.io): the operational pieces.** Event triggers (webhooks fired when rows change), allow-lists of operations, depth and node limits, a console. Hasura showed that a generated API needs production features around it, not only a schema.

**[PostgREST](https://postgrest.org): one statement per request.** PostgREST's design principle is that "the structural constraints and permissions in the database determine the API endpoints and operations", and every request runs as one SQL statement in one transaction. It has done this in production since 2014, and its HTTP surface is still broader than graphpg's.

---

## What I did differently

![One engine: GraphQL and REST requests share one operation plan, compiled into one SQL statement against PostgreSQL, whose catalog defines the schema](/images/blog/one-engine-poster.png)

### 1. One engine behind both APIs

GraphQL and REST in graphpg are two front ends to the same operation plan. A REST call such as `GET /rest/posts?filter[status][eq]=PUBLISHED&include=tags` and the equivalent GraphQL query become the same plan, so they share filters, ordering, keyset pagination, nested writes, safety limits, authorization and error codes. A filter operator added for one exists in the other the same day.

I keep a [parity document](https://mihailtd.github.io/graphpg/docs/graphql-openapi-parity) of what each API knows about the database, and treat a gap as a bug. Put two separate tools in front of one database, say PostGraphile for GraphQL and PostgREST for REST, and they drift on exactly these details. One supports a filter the other lacks, an error comes back in a different shape, a limit holds on one side only.

### 2. Every request is one SQL statement

A nested GraphQL selection compiles to lateral joins and JSON aggregation, so a query for twenty posts with their authors and comments is one round trip, never one query per post (the N+1 problem). Connections page by keyset (`WHERE (created_at, id) < (…)`), an index seek on every page. Limits on page size, depth and cost are checked on the plan before any SQL runs.

I measured it against PostgREST 16.4 on the same PostgreSQL 18.6 database, with the k6 scripts in [`benchmarks/rest`](https://github.com/mihailtd/graphpg/tree/main/benchmarks/rest) (one run, one machine, 2026-10-07). Reads ran at 1.4 to 3 times the throughput. Deep `offset` pagination came out about even, bulk updates by filter 2% behind, and single-row writes 1.1 to 1.4 times ahead:

![Requests per second, graphpg 1.0.1 against PostgREST 16.4 on PostgreSQL 18.6: single row by key 74,031 against 24,606; keyset pagination 35,040 against 22,077; list of 20 rows 33,426 against 21,282; filtered list 32,501 against 19,894; 20 posts with author and comments 17,227 against 11,995 | wide](/images/blog/benchmark-throughput.png)

Treat that as one data point, not a ranking. Throughput depends far more on your schema, indexes and hardware than on the server, so run the benchmark on yours.

### 3. No plugins, no custom resolvers

This is the decision people question most. PostGraphile has a plugin system; Hasura has actions and remote schemas. graphpg has neither, on purpose ([decision record](https://mihailtd.github.io/graphpg/docs/extending)).

A resolver running inside the server is not part of the statement: it adds a round trip per row unless it batches, it runs outside the transaction and outside RLS, and the limits estimated on the plan no longer bound the request. A plugin runtime is also a product of its own, with an API to keep stable through every upgrade.

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

graphpg ships as a static binary on a distroless image (about 27 MB, no shell, non-root, signed with Sigstore). It reads PostgreSQL 17 and 18 features into the schema without hand-written SQL: temporal keys (`WITHOUT OVERLAPS`), `RETURNING OLD`, `JSON_TABLE` views, `NOT ENFORCED` constraints.

---

## Why GraphQL and REST need to coexist

The GraphQL-or-REST debate assumes you pick one. In the projects I have worked on, teams end up with both, because each is better at a different job.

**GraphQL is better for user interfaces.** A screen asks for exactly the fields it renders, across relations, in one round trip. The schema is typed and introspectable, so a client generator produces the exact result type of every query. When the UI changes, the query changes with it, and the server does not need a new endpoint.

**REST is better at the edges of the system.** HTTP caching with `ETag`s, a `curl` command in a runbook, webhooks, CSV and NDJSON exports, partners who expect plain HTTP, services written in languages with weak GraphQL tooling. And now AI agents: many agent frameworks build their tools directly from an OpenAPI document, and a REST call with typed parameters maps neatly onto a tool call.

The problem is never having both. It is having two implementations of the same rules: a GraphQL server with one idea of what "published" means and a REST layer with another, or a field hidden from one API and readable through the other. When both APIs come from one plan, coexisting is cheap. You get the GraphQL schema for the app and the OpenAPI document for everything else, and both answer to the same constraints and policies.

---

## How I built it

graphpg is about 55,000 lines of Rust, with about 47,000 lines of integration tests (575 test functions) that run against a real PostgreSQL 18. Every documented behavior has a test, which matters more than usual for a tool that generates an API from someone else's schema.

I built most of it with AI coding agents: 78 of the 97 commits in the public history were co-authored with Claude. That only worked because of the same discipline the tool itself encourages. The tests define what "done" means, the compiler rejects most mistakes before they run, and every change is small enough to review. When the agents got something wrong, a failing test caught it in the same session in most cases, not me a week later.

The FHIR schema did the exploratory testing. A crawler and a fuzzer (a tool that sends malformed inputs) generated requests against everything the 177-table schema exposes, and found real bugs: authorization claims, concurrent schema changes, failover between replicas. Those fixes shipped in 1.1.0, the first published release and the start of a stable API under semantic versioning.

---

## Where graphpg fits, and where it does not

graphpg fits when you want a small service you configure rather than program, your authorization already lives in PostgreSQL (roles, grants, RLS), and you want GraphQL and REST to agree because both come from one place.

Something else fits better when:

- You need to join APIs and services (not only databases) in one query: Hasura or PostGraphile.
- You need streaming subscriptions (each new row from a cursor) or an admin console: Hasura.
- You need REST features PostgREST has had a decade to build, such as spread embeds or custom media types: PostgREST.

The [comparison page](https://mihailtd.github.io/graphpg/docs/comparison) lists each difference, including where the others are broader.

---

## Key takeaways

- **Most teams end up running GraphQL and REST, and two implementations of the same rules drift.** Solution: generate both from one plan, so filters, limits, errors and authorization stay identical.
- **A generated API is only as fast as the round trips it makes.** Solution: compile each request into one SQL statement with lateral joins and keyset pagination, and check limits on the plan before running it.
- **Plugins and custom resolvers break the guarantees that make a generated API safe.** Solution: put behavior in SQL functions, constraints, policies and event triggers, and compose anything else at the gateway.
- **An API contract that is not checked in CI will drift.** Solution: commit the SDL and OpenAPI document, fail CI on drift, and refuse to start in production on a mismatched schema.

graphpg is open source under MIT or Apache-2.0. The [documentation](https://mihailtd.github.io/graphpg/) has a one-minute Docker quick start, and the code is on [GitHub](https://github.com/mihailtd/graphpg).
