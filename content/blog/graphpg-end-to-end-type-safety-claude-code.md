---
title: "End-to-End Type Safety for Claude Code: PostgreSQL Schema to GraphQL SDL with GraphPG"
description: "Why manual Zod tool contracts drift from your database, and how GraphPG compiles PostgreSQL schemas into GraphQL SDL to generate end-to-end TypeScript types that stop AI tool hallucinations at compile time."
date: "2026-11-10"
type: "blog_post"
tags:
  [
    "postgresql",
    "graphpg",
    "graphql",
    "typescript",
    "claude-code",
    "agentic-ai",
  ]
cover_image: "/images/covers/graphpg-end-to-end-type-safety-claude-code.png"
canonical_url: "https://mihai.ltd/blog/graphpg-end-to-end-type-safety-claude-code/"
---

# End-to-End Type Safety for Claude Code: PostgreSQL Schema to GraphQL SDL with GraphPG

_Why do coding agents hallucinate database tool arguments, and how does generating TypeScript types from PostgreSQL schemas through GraphQL SDL stop contract drift?_

When developers build tools for Claude Code or Model Context Protocol (MCP) servers, they typically reach for manual schema validators like Zod to define input arguments:

```typescript
// Fragile: A hand-written Zod contract decoupled from the database catalog
export const UpdateRecordSchema = z.object({
  recordId: z.string().uuid(),
  status: z.enum(["active", "archived", "pending"]),
  metadata: z.record(z.unknown()).optional(),
});

server.tool(
  "update_record",
  "Updates database record status",
  UpdateRecordSchema.shape,
  async (args) => {
    // Manual SQL execution with unverified column mappings
    return db.query("UPDATE records SET status = $1 WHERE id = $2", [
      args.status,
      args.recordId,
    ]);
  },
);
```

At first glance, this approach appears safe. Zod validates incoming payloads at runtime, rejecting malformed tool calls from the model.

The hidden failure lies in **contract drift**.

A handwritten Zod schema lives strictly in application code. It knows nothing about the underlying PostgreSQL database. When a database migration renames a column, alters a nullability constraint, or updates an enum type in the catalog, your Zod definitions remain frozen.

The application compiles cleanly. The JSON Schema exposed to Claude Code appears valid. But when the agent calls the tool during a multi-file refactor, the database rejects the query with runtime syntax or constraint violations. The agent enters an expensive retry loop, burning tokens trying to guess the correct schema shape.

To make agentic tool calling reliable, you must cut manual contracts. Your database schema must serve as the single source of truth, generating types all the way to the agent tool boundary.

---

## The Fragility of Application-Layer Tool Contracts

When an AI agent modifies code or calls operational tools, manual schemas introduce three compounding vulnerabilities:

1. Dual schema maintenance forces developers to write the data model twice—first in SQL migrations or ORM schemas, then in Zod validators for MCP tools. Over dozens of tables, engineers inevitably miss updating tool signatures when altering relational columns.
2. Invisible schema drift occurs when PostgreSQL alters a column default or drops a table key. The TypeScript compiler has no visibility into the mismatch because Zod types run in isolation from database DDL.
3. Agent hallucination loops trigger when an unhandled database error bubbles up to Claude Code through an MCP tool. The model attempts to self-correct by inventing arbitrary argument names (`record_id`, `id`, `uuid`), compounding the failure.

---

## The Solution: The Database-Driven Type Chain

Instead of manually duplicating schemas in Zod, we construct an automated, end-to-end type generation pipeline:

```text
┌──────────────────────────────────────────────┐
│  Single Source of Truth: PostgreSQL Catalog  │
│      (Tables, Columns, Checks, Enums)        │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│        GraphPG High-Performance Engine       │
│      (Compiles Catalog to GraphQL SDL)       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           GraphQL Code Generator             │
│   (Emits Typed Document Nodes & TS Types)    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│     Claude Code / MCP Tool Implementation    │
│    (Deterministic Compile Errors on Drift)   │
└──────────────────────────────────────────────┘
```

This pipeline relies on four tightly coupled stages:

1. Define the data model once in standard SQL migrations, establishing PostgreSQL as the single source of truth.
2. GraphPG monitors the PostgreSQL catalog. Whenever a migration runs, GraphPG introspects the schema and rewrites `schema.graphql` (the GraphQL SDL) and `openapi.json` in milliseconds.
3. GraphQL Code Generator consumes `schema.graphql` and emits static TypeScript types for every query, mutation, and filter.
4. MCP tools consume the generated TypeScript operation types. If a column changes, `tsc` immediately fails across every tool implementation before runtime execution.

---

## Wiring GraphPG to Claude Code Tools

### 1. Generating the GraphQL SDL

Consider a healthcare schema defining clinical records. In PostgreSQL:

```sql
CREATE TYPE record_status AS ENUM ('active', 'archived', 'pending');

CREATE TABLE clinical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    patient_name TEXT NOT NULL,
    status record_status NOT NULL DEFAULT 'active',
    diagnosis TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
```

When this migration executes, GraphPG reflects the table directly into `schema.graphql`:

```graphql
enum RecordStatus {
  active
  archived
  pending
}

type ClinicalRecord {
  id: UUID!
  organizationId: UUID!
  patientName: String!
  status: RecordStatus!
  diagnosis: String!
  createdAt: DateTime!
}

input UpdateClinicalRecordInput {
  status: RecordStatus
  diagnosis: String
}
```

### 2. Defining Typed Operations

Rather than writing hand-crafted schemas, we define a typed GraphQL document:

```graphql
mutation UpdateClinicalRecord($id: UUID!, $input: UpdateClinicalRecordInput!) {
  updateClinicalRecord(id: $id, input: $input) {
    id
    status
    diagnosis
  }
}
```

Running GraphQL Code Generator outputs exact TypeScript types:

```typescript
// Generated automatically from schema.graphql
export type UpdateClinicalRecordMutationVariables = {
  id: string;
  input: {
    status?: RecordStatus;
    diagnosis?: string;
  };
};

export type UpdateClinicalRecordMutation = {
  updateClinicalRecord?: {
    id: string;
    status: RecordStatus;
    diagnosis: string;
  } | null;
};
```

### 3. Registering the Tool with Generated Types

Now the MCP tool handler directly references the generated types:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeGraphQL } from "./graphql-client.js";
import {
  UpdateClinicalRecordDocument,
  UpdateClinicalRecordMutationVariables,
} from "./generated/graphql.js";

const server = new McpServer({
  name: "clinical-tools",
  version: "1.0.0",
});

// The input contract directly binds to the database-generated GraphQL variables
server.tool(
  "update_clinical_record",
  "Updates a patient record status and diagnosis",
  async (args: UpdateClinicalRecordMutationVariables) => {
    const result = await executeGraphQL(UpdateClinicalRecordDocument, {
      id: args.id,
      input: args.input,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(result.data) }],
    };
  },
);
```

---

## What Happens When the Database Changes

Imagine an engineer alters the database schema:

```sql
ALTER TABLE clinical_records RENAME COLUMN diagnosis TO clinical_summary;
```

Here is what happens in the developer environment:

1. GraphPG detects the catalog update and regenerates `schema.graphql` within 90 milliseconds.
2. The code generator runs and updates `generated/graphql.js`.
3. The TypeScript compiler immediately flags `UpdateClinicalRecordDocument`:

```text
src/tools/clinical.ts:24:9 - error TS2322: Type '{ diagnosis: string; }' is not assignable to type 'UpdateClinicalRecordInput'.
  Property 'diagnosis' does not exist on type 'UpdateClinicalRecordInput'. Did you mean 'clinical_summary'?
```

When Claude Code works on the repository, it does not encounter an ambiguous database runtime error. It sees a precise `tsc` error pointing directly to the affected line.

Instead of guessing argument formats or hallucinating field names, the agent reads the compiler error and updates the tool query cleanly in a single pass.

---

## Key Takeaways

- Stop maintaining parallel Zod schemas for AI agent tools when your database catalog already defines your data model.
- Use GraphPG to compile PostgreSQL catalog structures into GraphQL SDL instantly upon schema changes.
- Let GraphQL Code Generator produce strict TypeScript types so that database migrations turn agent hallucinations into deterministic compiler errors before execution.
