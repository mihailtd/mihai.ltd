---
title: "Why Row-Level Security Is the Safest Place for Authorization in AI-Built Apps"
description: "Why AI coding agents leave tenant filters out of queries, and how PostgreSQL Row-Level Security (RLS) moves authorization into the database, where one short policy covers every query and is easy to review."
date: "2026-10-18"
type: "blog_post"
tags: ["postgresql", "security", "ai", "graphpg", "architecture"]
cover_image: "/images/covers/row-level-security-ai-coding-agents.png"
---

# Why Row-Level Security Is the Safest Place for Authorization in AI-Built Apps

_How many times has an AI coding agent written a feature that works, and left the tenant filter out of the query?_

Ask an AI coding agent to add a new dashboard view or export endpoint. It reads your models, writes the query, wires up the route, writes unit tests, and presents a clean diff. The tests pass and the feature works in development.

Then you look closely at the database query:

```ts
const reports = await db
  .select()
  .from(medicalReports)
  .where(eq(medicalReports.status, "FINALIZED"));
```

The agent remembered to filter by status. It forgot to filter by `tenant_id` or `organization_id`.

In a single-tenant development database with ten seed rows, that query behaves properly. In a multi-tenant staging or production cluster, it leaks every customer's medical records to whichever user called the endpoint.

This is not a defect unique to language models; people make the same mistake under deadline. But an agent can repeat it across dozens of files in one session, and as a codebase grows from five tables to fifty, the odds that some query misses the scoping filter keep climbing.

Prompting the agent to "remember security" won't fix it. Moving authorization into the database with PostgreSQL Row-Level Security (RLS) will: the filter is applied whether the query asks for it or not.

---

## Why application-layer authorization breaks

Most web applications enforce multi-tenancy and data ownership in the application layer:

1. A middleware verifies the session token and extracts the `user_id` or `tenant_id`.
2. The controller passes that context down through services, repositories, or resolvers.
3. Every individual database query explicitly includes `WHERE tenant_id = context.tenant_id`.

This model is fragile because every read and every write has to get it right.

![Application-layer authorization requires manual checks across fifty files; database Row-Level Security enforces authorization in one place](/images/blog/rls-vs-app-auth-poster.png)

If an application exposes 80 database queries across its routes, resolvers, background workers, and search endpoints, authorization must succeed 80 times out of 80. One missed `WHERE` clause in query 47 is enough to leak data.

When AI coding agents author software, application-layer authorization breaks down for three specific reasons:

### 1. Search recall fails on growing codebases

When an agent writes a new feature, it searches the repository for existing patterns. If your codebase uses slightly different parameter names across modules (`tenantId`, `organization_id`, `orgId`, `account_id`), the model's context retrieval misses the authorization pattern in adjacent files. It generates a query based on the table columns it sees, without knowing that a custom wrapper scopes the query.

### 2. Happy-path test generation

Agents write tests for the code they just created. If an agent writes a query that lacks tenant scoping, its accompanying test seeds records for one user, queries the endpoint, and asserts that the records returned match what it seeded. The tests pass with full line coverage, and the cross-tenant leak ships with them.

### 3. Imperative complexity vs declarative rules

Application-layer authorization is imperative: developers write branching logic (`if (!user.canRead(doc)) throw new Forbidden()`) scattered across controllers. An agent asked to refactor or extend an endpoint easily deletes, bypasses, or moves an authorization guard above an asynchronous fetch.

---

## Enforcing the boundary at the data layer

PostgreSQL Row-Level Security reverses this model. Instead of relying on application code to remember security rules on every query, you define the rules once as declarative database policies on the table:

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Enforce tenant isolation for all authenticated operations
CREATE POLICY tenant_isolation_policy ON documents
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (tenant_id = current_setting('app.tenant_id', true));

-- Enforce ownership for document modification
CREATE POLICY document_owner_policy ON documents
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING (owner_id = current_setting('request.jwt.claim.sub', true))
  WITH CHECK (owner_id = current_setting('request.jwt.claim.sub', true));
```

Once you enable RLS, PostgreSQL's query rewriter evaluates these policies against every statement executed by the `authenticated` role.

If an AI coding agent writes an unfiltered query:

```sql
SELECT id, name, department FROM documents;
```

PostgreSQL adds the policies to the query, so it runs as if you had written:

```sql
SELECT id, name, department FROM documents
WHERE tenant_id = current_setting('app.tenant_id', true)
  AND owner_id = current_setting('request.jwt.claim.sub', true);
```

Even if the agent writes `DELETE FROM documents;` without a `WHERE` clause, the database deletes only the rows owned by the current session's subject in the current tenant. As long as the application connects as `authenticated`, no query the agent writes can reach another customer's rows.

---

## Auditing: one migration vs fifty files

For teams working with AI coding agents, the main gain is in review.

When an agent submits a pull request with application-layer authorization, the human reviewer must inspect every changed route, controller, ORM invocation, and SQL builder across every changed file, checking that:

- The tenant context extracted in middleware reached the query.
- The query builder joined the correct scoping table.
- No spread operator or unfiltered search bypassed the tenant filter.

With Row-Level Security, the reviewer audits the database migration:

```sql
CREATE POLICY team_access_policy ON medical_records
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    department = current_setting('request.jwt.claim.department', true)
    AND current_setting('request.jwt.claim.role', true) = 'physician'
  );
```

The reviewer reads five lines of SQL. If they match your security specification, **every query the agent writes, now or six months from now, follows that policy**.

In my experience, models also get a policy right more often than they keep dozens of controller guards consistent. A policy is short and self-contained; the guards are spread across files the agent may never open.

---

## In action: How graphpg implements RLS

We built **[graphpg](https://mihailtd.github.io/graphpg/)** (our in-house open-source API engine, tracked on our [technology radar](/blog/graphpg)) specifically around this architecture.

graphpg acts as an OAuth 2.0 resource server. It verifies incoming JWT access tokens and compiles both GraphQL and REST requests into single SQL statements executed inside a PostgreSQL transaction.

### How claims become database session settings

When a client sends an authorized request:

```bash
curl -H "Authorization: Bearer <token>" \
  https://api.example.com/rest/documents
```

graphpg verifies the token signature, checks expiry and audience, and opens a transaction. Before running the query, it executes a batched `set_config` statement within that transaction:

```sql
SELECT
  set_config('role', 'authenticated', true),
  set_config('request.jwt.claim.sub', 'alice', true),
  set_config('request.jwt.claim.role', 'editor', true),
  set_config('request.jwt.claim.department', 'cardiology', true),
  set_config('app.tenant_id', 'tenant-1', true);
```

The third argument (`is_local = true`) scopes these settings to the current transaction, and PostgreSQL discards them on commit or rollback. A pooled connection never carries one request's claims into the next.

### What the tests check

In graphpg's test suite ([`crates/graphpg/tests/rls_auth.rs`](https://github.com/mihailtd/graphpg/blob/main/crates/graphpg/tests/rls_auth.rs)), we check this against a real PostgreSQL database with two tenants and two departments:

```rust
// A token for Alice in cardiology, tenant-1
let alice_token = token(json!({
    "sub": "alice",
    "role": "editor",
    "department": "cardiology",
    "tenant": "tenant-1"
}));

// An agent issues an unfiltered GraphQL query
let response = app
    .oneshot(
        Request::post("/graphql")
            .header("authorization", format!("Bearer {alice_token}"))
            .header("content-type", "application/json")
            .body(Body::from(json!({
                "query": "{ documents { nodes { id name ownerId department tenantId } } }"
            }).to_string()))
            .unwrap(),
    )
    .await
    .unwrap();
```

Even though the GraphQL query requested all documents without filters:

- Alice sees her own cardiology documents in `tenant-1`.
- Bob's neurology documents in `tenant-1` remain hidden.
- Evan's cardiology documents in `acme-2` remain hidden.
- Unauthenticated requests run as `anon` and see only public documents.

The query looked like a security hole, and the database returned only Alice's rows.

---

## RLS and end-to-end type safety

Row-Level Security covers who can see which rows. In [How End-to-End Type Safety Turns "Change It Everywhere" Into a List Your AI Agent Can Finish](/blog/end-to-end-type-safety-ai-coding-agents) I wrote about the other half: what happens when an agent changes the shape of the data.

The two checks catch different mistakes:

1. **Types, at build time.** A schema change regenerates the GraphQL SDL and the OpenAPI document, and from them the TypeScript types. If an agent renames a column or leaves out a required input, `tsc` fails before the code runs.
2. **Policies, at run time.** When the code runs, PostgreSQL applies the tenant and ownership rules. An unfiltered query returns only the rows the user may see.

Neither depends on the agent remembering anything.

---

## Best practices for RLS in agentic applications

If you adopt RLS for agent-assisted projects, keep three operational practices in mind:

### 1. Separate table owners from application roles

PostgreSQL superusers and table owners bypass Row-Level Security by default. Make sure your application connects as an unprivileged login role (such as `authenticator`) that switches to `authenticated` or `anon`. Never run application queries as the database owner or superuser, or apply `ALTER TABLE ... FORCE ROW LEVEL SECURITY` if the owner must connect directly.

### 2. Combine PERMISSIVE and RESTRICTIVE policies

Use `PERMISSIVE` policies (the default) to define business access rules: document owners can read their files, and department editors can read departmental files.

Combine them with an `AS RESTRICTIVE` policy for tenant isolation:

```sql
CREATE POLICY tenant_barrier ON documents
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (tenant_id = current_setting('app.tenant_id', true));
```

A row is visible only when every `RESTRICTIVE` policy passes and at least one `PERMISSIVE` policy does. A permissive rule written too broadly still can't open rows in another tenant.

### 3. Index your policy columns

Row-Level Security adds the policy conditions to every query on the table. If your policy checks `tenant_id` and `owner_id`, composite indexes covering `(tenant_id, owner_id)` keep the added predicate an index lookup instead of a scan.

---

## Key takeaways

- **Application-layer authorization is too fragile for AI coding agents.** An agent writing dozens of queries will sooner or later miss a scoping filter.
- **Row-Level Security moves the boundary into PostgreSQL.** An unfiltered query from an agent still returns only the rows the policies allow.
- **Reviewers check one short policy instead of fifty controllers.** The policy applies to every query, including the ones written next month.
- **graphpg sets the session from verified JWT claims on every request.** The same policies apply to GraphQL and REST.

To learn more about configuring authentication and session settings in graphpg, explore the [Authentication and RLS Guide](https://mihailtd.github.io/graphpg/docs/authentication) and the [AI Agents Guide](https://mihailtd.github.io/graphpg/docs/ai-agents) on the [graphpg documentation website](https://mihailtd.github.io/graphpg/).
