---
title: "Why Row-Level Security Is the Only Reliable Auth for AI-Built Apps"
description: "Why AI coding agents routinely introduce data leaks in application-layer authorization, and how PostgreSQL Row-Level Security (RLS) turns authorization into an auditable data-layer barrier that no agent query can bypass."
date: "2026-10-18"
type: "blog_post"
tags: ["postgresql", "security", "ai", "graphpg", "architecture"]
cover_image: "/images/covers/row-level-security-ai-coding-agents.png"
---

# Why Row-Level Security Is the Only Reliable Auth for AI-Built Apps

_How many times has an AI coding agent written a flawless feature, only to leave out the tenant filter in the query?_

Ask an AI coding agent to add a new dashboard view or export endpoint. It reads your models, builds an expressive query, wires up the route, writes unit tests, and presents a clean diff. The tests pass and the feature works in development.

Then you look closely at the database query:

```ts
const reports = await db
  .select()
  .from(medicalReports)
  .where(eq(medicalReports.status, "FINALIZED"));
```

The agent remembered to filter by status. It forgot to filter by `tenant_id` or `organization_id`.

In a single-tenant development database with ten seed rows, that query behaves properly. In a multi-tenant staging or production cluster, it leaks every customer's medical records to whichever user called the endpoint.

This is not a defect unique to language models; human developers make the same mistake under fatigue or tight deadlines. But coding agents make this error at machine speed across dozens of files. As a codebase expands from five tables to fifty, search recall degrades, and the probability of an agent missing a scoping filter in some obscure query approaches certainty.

The solution is not prompting the agent to "remember security." The solution is moving the authorization boundary into the database engine itself using PostgreSQL Row-Level Security (RLS).

---

## The structural flaw of application-layer authorization

Most web applications enforce multi-tenancy and data ownership in the application layer:

1. A middleware verifies the session token and extracts the `user_id` or `tenant_id`.
2. The controller passes that context down through services, repositories, or resolvers.
3. Every individual database query explicitly includes `WHERE tenant_id = context.tenant_id`.

This model is structurally fragile because it requires **flawless discipline across every single read and write**.

![Application-layer authorization requires manual checks across fifty files; database Row-Level Security enforces authorization in one place](/images/blog/rls-vs-app-auth-poster.png)

If an application exposes 80 database queries across its routes, resolvers, background workers, and search endpoints, authorization must succeed 80 times out of 80. A single missed `WHERE` clause in query 47 compromises the entire security posture of the product.

When AI coding agents author software, application-layer authorization breaks down for three specific reasons:

### 1. Search recall fails on growing codebases

When an agent writes a new feature, it searches the repository for existing patterns. If your codebase uses slightly different parameter names across modules (`tenantId`, `organization_id`, `orgId`, `account_id`), the model's context retrieval misses the authorization pattern in adjacent files. It generates a query based on the table columns it sees, without knowing that a custom wrapper scopes the query.

### 2. Happy-path test generation

Agents write tests for the code they just created. If an agent writes a query that lacks tenant scoping, its accompanying test seeds records for one user, queries the endpoint, and asserts that the records returned match what it seeded. The test suite passes with full line coverage while harboring a critical cross-tenant data leak.

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

PostgreSQL does not execute an unfiltered table scan. It transparently rewrites the execution tree to:

```sql
SELECT id, name, department FROM documents
WHERE tenant_id = current_setting('app.tenant_id', true)
  AND owner_id = current_setting('request.jwt.claim.sub', true);
```

Even if the agent writes `DELETE FROM documents;` without a `WHERE` clause, the database deletes only the rows owned by the current session's subject in the current tenant. The agent cannot leak or destroy another customer's data because the database kernel prevents it.

---

## Auditing: one migration vs fifty files

The greatest benefit for teams pairing with AI coding agents is **auditability**.

When an agent submits a pull request with application-layer authorization, the human reviewer must inspect every changed route, controller, ORM invocation, and SQL builder across twenty files, verifying that:

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

The reviewer reads five lines of declarative SQL. If those five lines match your security specification, **every query the agent writes now or six months from now will adhere to that policy**.

Language models also write declarative SQL policies with much higher precision than they maintain across dozens of imperative JavaScript or Python controller guards. Writing a constraint or a policy is a compact, self-contained task with decades of training data and formal relational logic behind it.

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

The third argument (`is_local = true`) instructs PostgreSQL to scope these settings strictly to the current transaction. When the transaction commits or rolls back, PostgreSQL discards the settings automatically. Connection pool poisoning is impossible because no session setting leaks into later pooled connections.

### Real-world test validation

In graphpg's test suite ([`crates/graphpg/tests/rls_auth.rs`](https://github.com/mihailtd/graphpg/blob/main/crates/graphpg/tests/rls_auth.rs)), we verify this exact behavior against a live PostgreSQL 18 instance with two isolated tenants and medical departments:

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

The agent authored a query that looked like a security hole, and the database answered with complete tenant isolation.

---

## Defensive architecture: RLS plus end-to-end type safety

Row-Level Security solves authorization at the data boundary. In an earlier article, we covered how [End-to-End Type Safety](/blog/end-to-end-type-safety-ai-coding-agents) solves schema drift at the compile-time boundary.

When you combine both patterns, you create a dual-barrier architecture for agentic development:

1. **Compile-time barrier (Types):** PostgreSQL catalog changes regenerate GraphQL SDL and OpenAPI 3.1 contracts via graphpg. Code generators convert contracts into TypeScript types. If an agent changes a column name or omits a required input, `tsc` fails before the code ever runs.
2. **Runtime barrier (RLS):** When the agent's code runs, PostgreSQL enforces tenant boundaries, ownership rules, and access control policies directly in the database kernel. If an agent generates an unfiltered query, the database limits the result set to the user's permitted rows.

Neither barrier requires trust in the model's memory, attention span, or prompt compliance.

---

## Best practices for RLS in agentic applications

If you adopt RLS for agent-assisted projects, keep three operational practices in mind:

### 1. Separate table owners from application roles

PostgreSQL superusers and table owners bypass Row-Level Security by default. Ensure your application connects as an unprivileged login role (such as `authenticator`) that switches to `authenticated` or `anon`. Never run application queries as the database owner or superuser, or apply `ALTER TABLE ... FORCE ROW LEVEL SECURITY` if the owner must connect directly.

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

PostgreSQL requires all `RESTRICTIVE` policies to pass alongside at least one `PERMISSIVE` policy. This prevents an overly broad permission policy from ever leaking records across tenant boundaries.

### 3. Index your policy columns

Row-Level Security injects policy predicates into every table scan. If your policy checks `tenant_id` and `owner_id`, composite indexes covering `(tenant_id, owner_id)` ensure policy evaluation remains sub-millisecond even on tables with millions of rows.

---

## Key takeaways

- **Application-layer authorization is too fragile for AI coding agents.** Agents authoring dozens of queries will eventually miss a scoping filter or spread an unvalidated input.
- **PostgreSQL Row-Level Security moves the boundary to the database kernel.** Unfiltered queries written by agents are transparently rewritten to include tenant and ownership rules.
- **Reviewers audit declarative SQL policies with predictable effort.** Human reviewers inspect a five-line SQL policy once, rather than verifying fifty scattered controllers across pull requests.
- **graphpg provides zero-drift RLS integration.** Session variables set per-transaction from verified JWT claims ensure seamless RLS enforcement across both GraphQL and REST.

To learn more about configuring authentication and session settings in graphpg, explore the [Authentication and RLS Guide](https://mihailtd.github.io/graphpg/docs/authentication) and the [AI Agents Guide](https://mihailtd.github.io/graphpg/docs/ai-agents) on the [graphpg documentation website](https://mihailtd.github.io/graphpg/).
