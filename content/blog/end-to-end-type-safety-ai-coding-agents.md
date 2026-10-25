---
title: "How End-to-End Type Safety Turns 'Change It Everywhere' Into a List Your AI Agent Can Finish"
description: "Why AI coding agents miss places when you ask them to change something everywhere, and how types generated from the database (SQL, GraphQL SDL, OpenAPI 3.1, TypeScript) turn every miss into a compiler error. Measured on a 177-table schema."
date: "2026-10-15"
type: "blog_post"
tags: ["typescript", "postgres", "graphql", "ai"]
cover_image: "/images/covers/end-to-end-type-safety-ai-coding-agents.png"
---

# How End-to-End Type Safety Turns "Change It Everywhere" Into a List Your AI Agent Can Finish

_How many times have you asked a coding agent to "rename this everywhere", and found the one place it missed a day later?_

You ask a coding agent to change something everywhere: rename a column, drop a field nobody uses, split `name` into `first_name` and `last_name`. The agent searches the repository, edits fourteen files, runs the tests, and tells you it is done. Then a screen nobody opened during the session breaks in staging, because the field was read through a string in a query, or a spread in a component, or a file the search pattern did not match.

The problem is more often search than the model. "Find every use of `family`" is a recall problem, and on a large codebase text search has poor recall: the same word means different things in different files, the same field is spelled three ways across layers (`family`, `familyName`, `FAMILY_ASC`), and some uses are only visible at run time. A person misses places for the same reasons; an agent just does it faster and with more confidence.

A better search won't fix that. Instead, make every place that uses the field fail to compile once the field changes, so the type checker produces the list of places, and the agent works through the list instead of guessing where to look.

That is what end-to-end type safety means in practice, and it matters more when an agent makes the change.

---

## What "end-to-end" type safety means

End-to-end type safety means **one source of truth for the shape of your data, and every layer's types generated from the layer before it**, from the database column to the UI component that renders it. Nobody writes the same type twice, so no two copies can disagree.

![The type-safety chain: a migration changes the PostgreSQL catalog, the API server rewrites the GraphQL SDL and the OpenAPI document, code generators turn them into TypeScript, and the type checker lists every broken use](/images/blog/type-safety-chain-poster.png)

In a typical stack that chain has four links:

1. **The schema**, in the database (tables, columns, constraints).
2. **The API contract**, a GraphQL SDL and an OpenAPI 3.1 document for REST.
3. **The client types**, generated TypeScript for every query, request and response.
4. **The type checker**, `tsc` and your editor, which compare every use against those types.

Many projects already have links 3 and 4. The weak spot is link 2: a contract written by hand, or generated from server code that someone else wrote by hand, drifts from the database without anyone noticing. When the contract is generated _from_ the database, a migration is enough to update every type downstream.

---

## Why SQL is a good schema language for AI agents

If the database is the source of truth, the schema language is SQL, or a thin layer over it. That turns out to be a good fit for agents, for three reasons.

**SQL is declarative and compact.** A table states its columns, keys, relations and rules in a few lines, and says _what_ is allowed instead of _how_ to check it. `CHECK (length(body) BETWEEN 1 AND 2000)` or `REFERENCES authors (id)` is one line, and PostgreSQL enforces it on every write, from every client, including the ones an agent writes next month. The same rules spread across validation functions, resolvers and controllers take hundreds of lines, each one a place to get wrong.

**Models write SQL well.** SQL has decades of public examples, documentation and answered questions behind it, so models have seen a lot of it. In my experience a schema migration is one of the more reliable things an agent produces, more reliable than a hand-rolled data layer with the same rules.

**It is auditable.** Every schema change is a migration: a file a person reviews in a pull request before it runs. With [Drizzle](https://orm.drizzle.team), a TypeScript ORM, the reviewer reads a small diff of the schema file, and `drizzle-kit generate` writes the SQL migration from it:

```diff
 export const patients = pgTable("patients", {
   id: uuid("id").primaryKey(),
-  family: text("family"),
+  familyName: text("family_name"),
   given: text("given"),
```

```sql
ALTER TABLE "patients" RENAME COLUMN "family" TO "family_name";
```

The agent proposes, a human reads two lines, and the database applies them in a transaction. Compare that with reviewing an agent's changes across a REST controller, a GraphQL resolver, two DTOs and a mapper, all of which have to agree.

---

## From the database to GraphQL and OpenAPI

The next link turns the schema into the API contract. A handful of tools read PostgreSQL's catalog and serve an API from it: [PostGraphile](https://postgraphile.org) and [Hasura](https://hasura.io) for GraphQL, [PostgREST](https://postgrest.org) for REST. We built [graphpg](https://mihailtd.github.io/graphpg/) in-house (and adopted it on our [technology radar](/blog/graphpg)) to do both from one engine: one Rust binary that serves a GraphQL API and a REST API from the same schema, and writes the two contracts to files:

- `schema.graphql`, the GraphQL SDL, with every type, field, filter, order option and error code.
- `openapi.json`, an OpenAPI 3.1 document, with every path, parameter, body and response, and `CHECK` constraints as JSON Schema keywords (`minLength`, `maximum`, `pattern`).

In development mode it watches the database for schema changes and rewrites both files after each one. The files go in the repository, so a schema change and the contract it produces arrive in the same pull request.

From there, standard tools do the rest:

- **GraphQL:** [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) with the `client` preset validates every query in the app against `schema.graphql` and generates the exact result type of each one.
- **REST:** [openapi-typescript](https://openapi-ts.dev) turns `openapi.json` into a `paths` type, and [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) uses it to type every call: the URL, the query parameters, the body and the response.

```ts
const api = createClient<
  paths,
  "application/json" | "application/problem+json"
>({ baseUrl });

const { data } = await api.GET("/rest/patients", {
  params: { query: { fields: ["id", "family", "given"], first: 20 } },
});
data?.map((p) => p.family);
```

Even the string `"family"` inside `fields` is checked: the OpenAPI document lists the table's columns as an enum, so a column name in a string literal is as safe as a property access.

If your whole stack is TypeScript, tRPC or a Zod schema shared between server and client gets you a similar guarantee without a contract file. The contract earns its place when there is more than one consumer: a mobile app, a Python service, an agent framework that builds tools from OpenAPI, a partner integration.

---

## What a rename looks like on a 177-table schema

I wanted real numbers rather than a demo on three tables, so I ran the rename above on the largest schema I have: a FHIR R5 data model (FHIR is the HL7 standard for exchanging healthcare records) with 177 tables, modelled in Drizzle. Its GraphQL schema runs to about 100,000 lines and its OpenAPI document to 38 MB. The client was a small TypeScript project with one GraphQL query and one REST call reading `patients.family`.

| Step                                             | Time         |
| :----------------------------------------------- | :----------- |
| Migration committed → `schema.graphql` rewritten | 0.63 s       |
| Migration committed → `openapi.json` rewritten   | 0.98 s       |
| GraphQL Code Generator validates the queries     | 4.8 s        |
| openapi-typescript writes the types              | 5.3 to 6.1 s |
| `tsc` checks the project                         | 0.3 s        |

From `ALTER TABLE` to errors in the editor took under ten seconds, and almost all of it was code generation on an unusually large contract. Most schemas are far smaller.

The GraphQL side failed at code generation, with the replacement in the message:

```text
✖ GraphQL Document Validation failed with 2 errors;
  Error 0: Value "FAMILY_ASC" does not exist in "PatientOrderBy" enum.
           Did you mean the enum value "ACTIVE_ASC", "FAMILY_NAME_ASC", or "ID_ASC"?
  Error 1: Cannot query field "family" on type "Patient".
```

The REST side failed in `tsc`, on both the property and the string literal:

```text
src/patients-rest.ts(8,39): error TS2322: Type '"family"' is not assignable to type
  '"active" | "address" | "birthDate" | ... | "familyName" | "fullName" | ...'.
src/patients-rest.ts(11,31): error TS2339: Property 'family' does not exist on type ...
```

A case-sensitive search for `family` would not have found `FAMILY_ASC`, and a search for the new name finds nothing until someone writes it. The type checker found it because it knows the enum value comes from the column.

---

## Why this matters more when an agent makes the change

A person reading compiler errors fixes them one by one and gets bored. An agent does not get bored, and compiler errors are close to ideal input for it:

- The checker reports every typed use, not the ones a search pattern happened to match. The agent's job changes from "find the places" (unbounded) to "fix this list" (bounded).
- Each error names the file, line and column, what the code expected, and often the fix itself ("Did you mean FAMILY_NAME_ASC?").
- The check costs seconds, so the agent re-runs it after each fix and stops when the list is empty. "Done" becomes a fact the tooling reports, not a claim the agent makes.

The loop also works in the other direction. When the agent writes new code against the API, the types tell it which fields exist, which are nullable and which error codes a mutation can return, so it does not have to guess from a sample response.

### PRO Tip #1: put the checker in the agent's definition of done

Give the agent one command that regenerates the types and runs the checker, and tell it the task is finished only when that command passes:

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts && openapi-typescript openapi.json -o src/api.d.ts",
    "check": "pnpm codegen && tsc --noEmit"
  }
}
```

In Claude Code you can go one step further and run it from a hook after every edit, so the errors come back to the agent without it having to remember to ask.

### PRO Tip #2: fail CI on contract drift

Commit the generated `schema.graphql` and `openapi.json`. In CI, regenerate them and fail when they differ from what is committed (graphpg has `graphpg schema export --check` for this). A migration then cannot merge without its contract, and the contract cannot merge without the client code that compiles against it.

---

## Where the chain stops

Types cover what crosses the API. In the same experiment, one thing broke that no type caught.

The FHIR schema has a computed column, `Patient.fullName`, backed by a SQL function that reads `p.family`. After the rename its GraphQL type was still `String`, and every request that selected it failed at run time. The function was written the common way, with its body as a string:

```sql
CREATE FUNCTION patient_full_name(p patients) RETURNS text
  LANGUAGE sql STABLE AS $$
    SELECT coalesce(p.family, '') || ', ' || coalesce(p.given, '');
  $$;
```

PostgreSQL stores a `$$ … $$` body as text, so it does not know the function reads `family`. The fix is a SQL-standard body (PostgreSQL 14 and later), which PostgreSQL parses when the function is created and tracks like a view:

```sql
CREATE FUNCTION patient_full_name(p patients) RETURNS text
  LANGUAGE sql STABLE
  RETURN coalesce(p.family_name, '') || ', ' || coalesce(p.given, '');
```

With that body, a rename updates the function on its own, and dropping the column fails with `cannot drop column ... because other objects depend on it`. PL/pgSQL functions are always stored as text, so they need tests that run after each migration.

Two other gaps are worth keeping in mind:

- **JSON columns.** A `jsonb` column is `JSON` in GraphQL and an untyped value in OpenAPI. If the client depends on its shape, give it a composite type or a domain, or validate it at the edge.
- **Types are compile-time only.** They describe what the server promises, not what a buggy server sends. Constraints in the database are what make the promise hold.

---

## Key takeaways

- **Asking an agent to "change it everywhere" is a recall problem, and text search has poor recall on large codebases.** Solution: derive every layer's types from one source, so every use the agent missed becomes a compile error.
- **A contract written by hand drifts from the database, quietly.** Solution: generate the GraphQL SDL and the OpenAPI document from the schema, commit them, and fail CI when they are out of date.
- **SQL is a good schema language for agents: compact, declarative, familiar to models and easy to review.** Solution: keep business rules in constraints and migrations (Drizzle if you want the schema in TypeScript), and review the migration rather than the code around it.
- **Agents are only as reliable as their definition of done.** Solution: one `check` command that regenerates the types and runs `tsc`, required to pass before the agent reports success.
- **Function bodies written as strings sit outside the type chain.** Solution: use SQL-standard `RETURN` / `BEGIN ATOMIC` bodies, so PostgreSQL tracks the columns they read.

The setup, the configuration and the full measurement are in the [end-to-end type safety guide](https://mihailtd.github.io/graphpg/docs/type-safety) on the [graphpg documentation website](https://mihailtd.github.io/graphpg/). If you want the story of why graphpg serves GraphQL and REST from one engine, I wrote that up in [Why GraphQL and REST Should Share One Engine: What I Learned Building graphpg](/blog/building-graphpg-graphql-and-rest-from-postgres).
