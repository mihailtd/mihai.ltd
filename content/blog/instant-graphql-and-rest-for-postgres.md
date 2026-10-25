---
title: "Instant GraphQL and REST from Any Postgres Database: Introducing graphpg"
slug: "instant-graphql-and-rest-for-postgres"
date: "2026-10-25"
type: "blog_post"
tags: ["postgres", "graphql", "rust", "api", "database"]
cover_image: "/images/covers/instant-graphql-and-rest-for-postgres.png"
description: "If you avoided GraphQL because of resolver boilerplate, or found tools like Hasura too heavy, here is what a database-first Rust engine looks like."
summary: "If you avoided GraphQL because of resolver boilerplate, or found tools like Hasura too heavy, here is what a database-first Rust engine looks like."
---

# Instant GraphQL and REST from Any Postgres Database: Introducing graphpg

_If you avoided GraphQL because of resolver boilerplate, or found tools like Hasura too heavy, here is what a database-first Rust engine looks like._

Many developers like the idea of GraphQL: instead of writing dozens of custom endpoints (`/users`, `/users/:id/posts`, `/posts/:id/comments`), your frontend requests the exact data shape it needs in a single request.

In practice, building a GraphQL API from scratch often stops people from adopting it. You write your SQL tables. Then you write a GraphQL schema that mirrors those tables. Then you write resolver functions for every field, write batch loaders to avoid N+1 query loops, and write custom validation. Before long, you are maintaining two copies of your data model and writing more boilerplate than you would have with plain REST.

Tools like [Hasura](https://hasura.io) and [PostGraphile](https://postgraphile.org) proved there is a better way: let the database define the API. But Hasura has grown into a large platform with metadata tracking, admin consoles, and cloud connectors. PostGraphile runs on Node.js and relies on an internal plugin system for extensions. And adopting either often meant abandoning REST or running a separate service alongside it.

We built **[graphpg](https://mihailtd.github.io/graphpg/)** to take a simpler path. It is an open-source, single static binary written in Rust. You point it at any PostgreSQL database, and it immediately serves both a GraphQL API and a REST API described by an OpenAPI 3.1 document. You don't write resolver code, configure metadata consoles, or maintain schema files by hand.

---

## Why building GraphQL by hand wears teams down

To understand why a database-first engine helps, look at what happens when you build a GraphQL server the traditional way.

Suppose you have two tables: `authors` and `posts`.

In a hand-rolled Apollo or Express server, you write:

1. The SQL migrations to create the tables.
2. The GraphQL SDL schema defining `type Author` and `type Post`.
3. The resolvers: a resolver to fetch authors, and a nested resolver to fetch posts for each author.

The moment you run a query like this:

```graphql
{
  authors {
    displayName
    posts {
      title
    }
  }
}
```

Your server runs one query to fetch ten authors, and then ten separate queries to fetch posts for each author. This is the classic N+1 query problem. To fix it, you introduce tools like DataLoader, configure batching keys, and add cache invalidation logic.

If a mobile app or an external webhook partner needs plain REST, you now write REST controllers on top of that, repeating the same validation rules and database queries.

The database already holds the table definitions, foreign keys, unique constraints, and descriptions. Having developers duplicate that information in application code creates drift.

---

## What graphpg does differently

graphpg treats PostgreSQL as the single source of truth. When the engine starts, it reads the database catalog: tables, views, relations, constraints, composite types, and comments.

From that catalog, it generates two APIs on the same port:

- **A GraphQL API** at `/graphql`, with Relay-style keyset pagination, nested filtering, relation traversal, and mutations.
- **A REST API** at `/rest`, with filtering, ordering, keyset pagination, nested writes, and an OpenAPI 3.1 document.

Both APIs run on the same internal query planner. When a client sends a request—whether GraphQL or REST—graphpg compiles the entire request into **a single SQL query** using lateral joins and JSON aggregation.

Twenty authors with their posts and comments resolve in one database round-trip, without N+1 queries or DataLoader setup.

---

## A concrete example in five minutes

You can run graphpg against an existing PostgreSQL database with Docker:

```bash
docker run --rm -p 4000:4000 \
  -e DATABASE_URL=postgres://user:pass@host.docker.internal:5432/mydb \
  ghcr.io/mihailtd/graphpg:1.3.0 --mode dev
```

In development mode (`--mode dev`), open `http://localhost:4000/graphiql` to explore the GraphQL schema, or `http://localhost:4000/scalar` for the interactive REST documentation.

Here is a simple blog schema:

```sql
CREATE TABLE authors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text NOT NULL UNIQUE,
    display_name text NOT NULL
);

CREATE TABLE posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES authors(id),
    title text NOT NULL,
    body text NOT NULL,
    published boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);
```

Without writing any backend code, you can query authors and their recent published posts through GraphQL:

```graphql
{
  authors {
    displayName
    postsConnection(
      first: 5
      filter: { published: { eq: true } }
      orderBy: [CREATED_AT_DESC]
    ) {
      nodes {
        title
        createdAt
      }
    }
  }
}
```

The database executes one query:

```sql
SELECT json_build_object(
  'authors', (
    SELECT json_agg(
      json_build_object(
        'displayName', __authors.display_name,
        'postsConnection', (
          SELECT json_build_object(
            'nodes', coalesce(json_agg(__posts_sub.row), '[]'::json)
          )
          FROM (
            SELECT json_build_object('title', __posts.title, 'createdAt', __posts.created_at) AS row
            FROM posts AS __posts
            WHERE __posts.author_id = __authors.id AND __posts.published = true
            ORDER BY __posts.created_at DESC
            LIMIT 5
          ) AS __posts_sub
        )
      )
    )
    FROM authors AS __authors
  )
);
```

If another client or script prefers REST, the exact same data is available over HTTP:

```bash
curl -g 'http://localhost:4000/rest/posts?filter[published][eq]=true&order=-createdAt&first=5&include=author'
```

Both queries share the same filters, pagination logic, and performance characteristics.

---

## How it compares to Hasura and PostGraphile

If you have explored database-first APIs before, you likely evaluated Hasura or PostGraphile. Here is how graphpg compares:

| Feature           | graphpg                                          | Hasura (v2 / v3)                        | PostGraphile v5                     |
| :---------------- | :----------------------------------------------- | :-------------------------------------- | :---------------------------------- |
| **Runtime**       | Single static Rust binary                        | Haskell / Rust (v3 DDN)                 | Node.js                             |
| **API formats**   | GraphQL and REST (OpenAPI 3.1)                   | GraphQL (REST via saved queries)        | GraphQL                             |
| **Configuration** | PostgreSQL catalog + optional `graphpg.yaml`     | Web console + metadata tracking files   | Plugins and smart comments          |
| **Execution**     | 1 SQL query per request                          | 1 SQL query per request                 | Batched plan steps                  |
| **Authorization** | PostgreSQL Row-Level Security (RLS)              | Hasura role permissions metadata        | PostgreSQL Row-Level Security (RLS) |
| **Extensions**    | SQL functions, event triggers, Apollo Federation | Actions, remote schemas, event triggers | JavaScript / TypeScript plugins     |

### 1. No separate metadata console

Hasura requires you to "track" tables and foreign keys in metadata, often managed through a web console or exported JSON files. In graphpg, foreign keys and tables are detected directly from PostgreSQL. If you add a table in a migration, it appears in the API. If you drop a foreign key, the relation disappears. An optional `graphpg.yaml` file lets you rename or hide fields, but you do not need it to get started.

### 2. Both GraphQL and REST out of the box

Hasura focuses primarily on GraphQL; REST endpoints exist by saving named GraphQL queries. PostGraphile focuses purely on GraphQL. graphpg treats REST and GraphQL as equal entry points to the same query planner.

### 3. A lightweight, self-contained binary

graphpg compiles to a single binary with no external runtime dependencies. The container image runs distroless without Node.js or JVM overhead, making it straightforward to deploy on Kubernetes, container instances, or alongside a local PostgreSQL development environment.

---

## Authorization stays in PostgreSQL

One common concern with generated APIs is security: how do you stop users from querying data they do not own?

Rather than inventing a custom permission language in configuration files, graphpg relies on PostgreSQL's native **Row-Level Security (RLS)**.

When a client makes a request with a JWT token:

1. graphpg validates the token signature against your identity provider's JWKS endpoint.
2. It opens a PostgreSQL transaction and sets transaction-local session settings based on the claims (such as `app.user_id` or `app.tenant_id`).
3. PostgreSQL evaluates the table's RLS policies against those session settings during query execution.

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_user_isolation ON posts
  FOR ALL
  TO authenticated
  USING (author_id = current_setting('request.jwt.claim.sub', true)::uuid);
```

Even if a client writes an unfiltered query requesting all posts, PostgreSQL ensures only rows belonging to the authenticated user are returned. The authorization logic lives in declarative SQL migrations, where it is version-controlled and auditable.

---

## Where graphpg fits, and where it does not

graphpg is a practical fit when:

- **You want an API without writing resolver boilerplate.** You have a PostgreSQL database and want frontend clients, internal tools, or mobile apps to query it directly with typed contracts.
- **You want both GraphQL and REST.** Your frontend team benefits from GraphQL, while third-party webhooks, scripts, and partners prefer standard REST endpoints.
- **You prefer declarative SQL over proprietary consoles.** You want schema and permission changes to live in standard SQL migrations rather than vendor-specific metadata formats.

graphpg is not the right choice when:

- **You need an interactive visual schema designer.** If you want a graphical web console to design tables and relationships with point-and-click tools, Hasura Console or Supabase Studio is a better fit.
- **You want in-process JavaScript resolver plugins.** If your architecture requires running custom Node.js code inside the API server's execution loop, PostGraphile's plugin ecosystem offers that flexibility.
- **Your data is spread across non-relational stores.** graphpg is built specifically around PostgreSQL catalogs (though it supports other databases through PostgreSQL foreign data wrappers). If your primary data lives in MongoDB or DynamoDB, you need a different engine.

---

## Key takeaways

- **Building GraphQL by hand involves maintaining duplicate schemas and solving N+1 query loops.** A database-first engine eliminates that boilerplate.
- **graphpg generates both GraphQL and OpenAPI 3.1 REST APIs from PostgreSQL catalogs.** You do not have to choose between GraphQL and REST.
- **Every request compiles into a single SQL statement.** Lateral joins and JSON aggregation keep database round-trips to one per request.
- **Permissions live in PostgreSQL Row-Level Security.** Your authorization logic stays in standard SQL policies rather than proprietary configuration layers.

graphpg is open source under MIT or Apache-2.0. You can explore the documentation and guides on the [graphpg documentation site](https://mihailtd.github.io/graphpg/) or view the code on [GitHub](https://github.com/mihailtd/graphpg).
