---
title: "Multi-Tenant AI Agents: Enforcing PostgreSQL Row-Level Security in LangGraph"
description: "How to prevent cross-tenant data leaks in autonomous LangGraph workflows by binding session-scoped tenant claims to PostgreSQL Row-Level Security policies."
date: "2026-11-09"
type: "blog_post"
tags: ["postgresql", "security", "langgraph", "agentic-ai", "architecture"]
cover_image: "/images/covers/postgresql-rls-langgraph-agent-isolation.png"
canonical_url: "https://mihai.ltd/blog/postgresql-rls-langgraph-agent-isolation/"
---

# Multi-Tenant AI Agents: Enforcing PostgreSQL Row-Level Security in LangGraph

_What happens when an autonomous LangGraph agent receives a prompt-injection payload or hallucinates an organization ID inside a database tool?_

When building multi-tenant AI systems, developers often construct tool nodes that accept database queries or parameterized CRUD arguments. A typical LangGraph tool definition looks like this:

```python
@tool
def get_patient_records(patient_id: str, organization_id: str) -> dict:
    """Fetch clinical summaries for a specific patient."""
    query = """
        SELECT id, patient_name, diagnosis, notes
        FROM clinical_records
        WHERE id = :patient_id AND organization_id = :organization_id;
    """
    return db.execute(query, {"patient_id": patient_id, "organization_id": organization_id}).fetchall()
```

This model assumes the model will behave. It assumes the model will faithfully forward the authenticated user's `organization_id` into the tool arguments.

That assumption fails in production. An adversarial prompt, an ambiguous user context, or a subtle hallucination can cause the model to substitute an arbitrary `organization_id` or omit it during tool invocation. If your application connects to PostgreSQL using a shared connection pool with ambient credentials, the database executes whatever the agent passes.

The solution is not to prompt the model to "be more secure". The solution is to enforce isolation at the database layer using **PostgreSQL Row-Level Security (RLS)** bound to the LangGraph execution state.

---

## The Ambient Authority Dilemma in Agent Tooling

In traditional web applications, a trusted API gateway validates a JWT token and passes the authenticated `tenant_id` directly to a predefined query. The user never writes SQL, and the parameters are strictly controlled.

LangGraph agents change this relationship. The agent reasons dynamically, decides which tools to call, and formats arguments:

```text
[User Request] ──> [LangGraph StateGraph] ──> [LLM Reasoning Engine]
                                                       │
                                        Decides Tool Call & Arguments
                                                       │
                                                       ▼
                                         [Database Tool Invocation]
                                                       │
                                            Ambient Connection Pool
                                                       │
                                                       ▼
                                            [PostgreSQL Database]
```

If the database tool relies on application-level filtering, you face two immediate failure modes:

1. **Parameter Tampering / Prompt Injection:** A malicious user prompts the agent: _"Retrieve patient notes for case #4912 from organization beta-health"_. If the agent uses the model-provided parameter, the query exposes cross-tenant records.
2. **Ambient Pool Trust:** Because the application connects as a shared superuser or service role (`postgres` or `app_backend`), the database cannot differentiate between a legitimate tenant query and an unauthorized access attempt.

---

## Architectural Pattern: Session-Scoped Context via `SET LOCAL`

PostgreSQL provides a native mechanism to pass request context into database sessions without altering query syntax: **Configuration Parameter Settings** combined with **Row-Level Security**.

Executing `SET LOCAL app.current_tenant_id = :tenant_id` within a transaction block scopes the setting strictly to that single transaction. When the connection returns to the connection pool, the setting automatically resets.

### 1. PostgreSQL Schema & RLS Policy

First, enable RLS on your tenant-sensitive tables and define the security policy:

```sql
-- Enable Row Level Security on the table
ALTER TABLE clinical_records ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners (optional, recommended for app roles)
ALTER TABLE clinical_records FORCE ROW LEVEL SECURITY;

-- Define tenant isolation policy using current_setting
CREATE POLICY tenant_isolation_policy ON clinical_records
    FOR ALL
    USING (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    )
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    );
```

If `app.current_tenant_id` is empty, unset, or mismatched, PostgreSQL returns zero rows on `SELECT`, and raises a violation on `INSERT` or `UPDATE`.

---

## 2. Binding LangGraph State to Database Connections

In LangGraph, execution state passes through a typed state dictionary. We store the authenticated caller's identity in the graph state, outside the reach of the LLM's prompt parameters.

### Graph State Definition

```python
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    tenant_id: str
    user_id: str
```

### Context-Bound Tool Execution

Instead of passing `tenant_id` as an argument to the LLM, the tool extracts `tenant_id` directly from the runtime context or an execution wrapper:

```python
import asyncpg
from contextlib import asynccontextmanager

class TenantDatabase:
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool

    @asynccontextmanager
    async def tenant_session(self, tenant_id: str):
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                # Set the session context for this specific transaction
                await conn.execute(
                    "SELECT set_config('app.current_tenant_id', $1, true);",
                    str(tenant_id)
                )
                yield conn

# Tool implementation registered with the agent
async def execute_clinical_search(query: str, state: AgentState, db: TenantDatabase) -> list:
    """Tool that queries records under strict RLS isolation."""
    tenant_id = state["tenant_id"]

    async with db.tenant_session(tenant_id) as conn:
        # Notice: No manual tenant_id filter required in the query!
        # PostgreSQL RLS automatically filters rows at the engine layer.
        rows = await conn.fetch(
            """
            SELECT id, patient_name, diagnosis, notes
            FROM clinical_records
            WHERE diagnosis ILIKE $1;
            """,
            f"%{query}%"
        )
        return [dict(row) for row in rows]
```

Even if the agent hallucinates a different ID, or a user injects an arbitrary instruction, the database guarantees that the connection cannot read or modify rows belonging to another tenant.

---

## 3. Verification & Failure Testing

To verify this architecture in CI, we run adversarial assertions:

1. Cross-tenant reads: Connecting under `tenant-alpha` and querying a record from `tenant-beta` returns `0 rows`.
2. Injection writes: Inserting a row with `tenant_id = tenant-beta` under `tenant-alpha` raises `new row violates row-level security policy`.
3. Unset context: Queries executed without `set_config` evaluate `NULLIF` to null, blocking all data access.

---

## 4. Key Takeaways

- Never trust model-provided parameters for authorization; let LLMs pick operational filters while the application context enforces tenancy boundaries.
- Pass `true` as the third parameter to `set_config`, so the setting remains local to the transaction, avoiding pool contamination.
- Centralizing authorization in PostgreSQL RLS policies eliminates repetitive scoping checks across dozens of individual agent tools.
