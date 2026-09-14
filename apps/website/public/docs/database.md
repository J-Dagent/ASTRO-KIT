# Serverless Database Setup

*Setup Guide*

Configure your database for edge connections

## Overview

Because edge request invocations run in isolation, database connections must be proxied through an HTTP server in order to not overwhelm database connections with too many concurrent connections.

Fortunately, most popular modern database providers offer **managed solutions** that handle proxied requests automatically, making it easy to connect from serverless and edge environments:

- **[PlanetScale](https://planetscale.com/docs/vitess/tutorials/planetscale-serverless-driver)** for MySQL and PostgreSQL with their serverless driver
- **[Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor-transaction-mode)** with Supavisor transaction mode for PostgreSQL
- **[Neon](https://neon.com/)** for PostgreSQL with built-in connection pooling
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)** for SQLite with edge-native architecture
- **[Turso](https://turso.tech/)** for SQLite with edge replication

## Step 1: Choose a database

For your serverless application, you'll need to select a database provider that supports edge environments. Here are the top options:

### Recommended: PlanetScale

**PlanetScale** offers exceptional developer experience with **branching workflows**, automatic scaling, and reliable serverless connections. Their MySQL-compatible service includes **zero-downtime schema changes**.

### Budget-Friendly Options with Free Tiers

If you're on a budget, these providers offer generous free tiers:

- **Supabase** - Full-stack platform with PostgreSQL and real-time features
- **Neon** - PostgreSQL with **instant branching** and auto-scaling
- **Turso** - Global SQLite with edge replication for ultra-low latency
- **Cloudflare D1** - Serverless SQLite that runs on Cloudflare's edge network

The budget-friendly options above offer **generous free tiers** to get you started without upfront costs.

## Step 2: Configure the database connection

In the `data-ops` package within your monorepo, you'll configure your database connection to manage schemas and create shareable queries across your application. This centralized approach ensures consistent database operations throughout your project.

The configuration will be defined in the **data-ops package**, which serves as the central hub for all database-related operations, including migrations, schema management, and query definitions that can be shared across different parts of your application.

### PostgreSQL Configuration

```bash
# packages/data-ops/.env
# PostgreSQL Configuration (Supabase, Neon, etc.)
DATABASE_HOST="hostname.com/database-name"
DATABASE_USERNAME="username"
DATABASE_PASSWORD="password"
```

### MySQL Configuration

```bash
# packages/data-ops/.env
# MySQL Configuration (PlanetScale, etc.)
DATABASE_HOST="hostname.com/database-name"
DATABASE_USERNAME="username"
DATABASE_PASSWORD="password"
```

### Cloudflare D1 Configuration

```bash
# packages/data-ops/.env
# Cloudflare D1 Configuration
CLOUDFLARE_DATABASE_ID="<From Cloudflare Dashboard>"
CLOUDFLARE_ACCOUNT_ID="<From Cloudflare Dashboard>"
CLOUDFLARE_D1_TOKEN="<Create in Cloudflare Dashboard>"
```

## Step 3: Setup Drizzle Kit

Drizzle Kit helps you manage your database schema and generate TypeScript types automatically. In the `data-ops` package within your monorepo, you'll configure Drizzle Kit to connect to your database and pull existing schemas into your project.

After configuring Drizzle Kit, you can run `pnpm run drizzle:pull` to pull in existing database schemas from your database to the project. The generated schemas will be available in `src/drizzle/schema.ts`, which you can then use to create type-safe queries throughout your application.

### PostgreSQL Drizzle Configuration

```typescript
// packages/data-ops/drizzle.config.ts
import type { Config } from "drizzle-kit";
const config: Config = {
  out: "./src/drizzle",
  schema: ["./src/drizzle/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}`,
  },
  tablesFilter: ["!_cf_KV", "!auth_*"],
};

export default config satisfies Config;
```

### MySQL Drizzle Configuration

```typescript
// packages/data-ops/drizzle.config.ts
import type { Config } from "drizzle-kit";
const config: Config = {
  out: "./src/drizzle",
  schema: ["./src/drizzle/auth-schema.ts"],
  dialect: "mysql",
  dbCredentials: {
    url: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}`,
  },
  tablesFilter: ["!_cf_KV", "!auth_*"],
};

export default config satisfies Config;
```

### Cloudflare D1 Drizzle Configuration

```typescript
// packages/data-ops/drizzle.config.ts
import type { Config } from "drizzle-kit";
const config: Config = {
  out: "./src/drizzle",
  schema: ["./src/drizzle/auth-schema.ts"],
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
  tablesFilter: ["!_cf_KV", "!auth_*"],
};

export default config satisfies Config;
```


## Step 4: Database runtime client

The active starter path is Neon → PostgreSQL → Drizzle ORM → `drizzle-orm/neon-http`. The data layer exposes an explicit factory so Astro requests and the Hono worker can create their own database without global initialization order:

```ts
// packages/data-ops/src/database/setup.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export interface DatabaseConnection {
  host: string;
  username: string;
  password: string;
}

export function createDatabase(connection: DatabaseConnection) {
  const connectionString =
    `postgres://${connection.username}:${connection.password}@${connection.host}`;
  return drizzle(neon(connectionString));
}
```

Astro owns the mapping from Cloudflare bindings to that framework-agnostic factory:

```ts
// apps/website/src/server/database.ts
import { env } from "cloudflare:workers";
import { createDatabase } from "@repo/data-ops/database/setup";

export function createRequestDatabase() {
  return createDatabase({
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
  });
}
```

Keep the environment variable names unchanged. PlanetScale/MySQL, Supabase, D1, and SQLite-compatible setups remain supported alternatives, but they are not active simultaneously. When changing provider, update the Drizzle driver, schema tooling, and Better Auth adapter as one coherent change.

# Database Queries

*Development Guide*

Create reusable, type-safe database queries for your serverless application

## Overview

The **data-ops package** serves as the centralized hub for all database operations in your monorepo. By organizing your queries here, you can create reusable, type-safe database functions that can be shared across multiple applications and services.

This approach promotes code reuse, maintains consistency across your applications, and ensures that database logic is properly tested and maintained in one location.

> **Tip:** Queries defined in the data-ops package are automatically type-safe when using Drizzle ORM, giving you excellent developer experience with autocompletion and compile-time error checking.

## Step 1: Create Your Database Queries (Optional)

Database queries are organized in the `packages/data-ops/src/queries/` directory. Each file typically groups related queries together (e.g., user operations, subscription management, etc.).

All queries use the `getDb()` function to access the database instance, ensuring consistent connection management across your serverless functions.

```typescript
// packages/data-ops/src/queries/polar.ts
import { getDb } from "@/database/setup";
import { subscriptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function updateSubscription(data: {
  userId: string;
  status: string;
  subscriptionId: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  startedAt?: string;
  productId: string;
}) {
  const db = getDb();
  await db
    .insert(subscriptions)
    .values({
      userId: data.userId,
      status: data.status,
      subscriptionId: data.subscriptionId,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      startedAt: data.startedAt,
      productId: data.productId,
    })
    .onConflictDoUpdate({
      target: [subscriptions.userId],
      set: {
        status: data.status,
        subscriptionId: data.subscriptionId,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        startedAt: data.startedAt,
        productId: data.productId,
      },
    });
}

export async function getSubscription(userId: string) {
  const db = getDb();
  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
  return subscription;
}
```

> **Best Practice:** Use descriptive function names and include proper TypeScript types for all parameters and return values. This makes your queries self-documenting and easier to use.

## Step 2: Export Queries in Package Configuration

To make your queries available to other packages in your monorepo, you need to configure the exports in `package.json` and build the package.

The data-ops package is already configured to export all queries under the `./queries/*` path, making them importable from other applications.

```json
// packages/data-ops/package.json
{
  "name": "@repo/data-ops",
  "exports": {
    "./queries/*": {
      "default": "./dist/queries/*.js",
      "types": "./dist/queries/*.d.ts"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json --outDir ./dist && tsc-alias"
  }
}
```

> **Important:** After creating or modifying queries, run `pnpm run build` in the data-ops package to compile the TypeScript and make the queries available to other applications.

## Step 3: Install the Data-Ops Package

Your applications need to include the data-ops package as a dependency to use the shared queries. In a monorepo setup, this is typically done using workspace references.

```json
// apps/website/package.json
{
  "name": "jd-astro-site",
  "dependencies": {
    "@repo/data-ops": "workspace:^"
  }
}
```

The `workspace:^` syntax tells pnpm to use the local workspace version of the package, ensuring you're always using the latest queries from your data-ops package.


## Step 4: Use queries in Astro and Hono

Import shared queries from `@repo/data-ops` into server-only website modules, Astro Actions, API routes, or the Hono data service. Do not import Astro from `packages/data-ops`.

```ts
// apps/website/src/server/example.ts
import { getUserById } from "@repo/data-ops/database/queries";
import { createRequestDatabase } from "@/server/database";

export async function loadUser(userId: string) {
  return getUserById(createRequestDatabase(), userId);
}
```

Expose browser-triggered mutations through a validated Astro Action:

```ts
// apps/website/src/actions/example.ts
import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { requireSession } from "@/server/auth";

export const updateProfile = defineAction({
  input: z.object({ displayName: z.string().min(1) }),
  handler: async (input, context) => {
    const session = await requireSession(context.request);
    return updateUser(createRequestDatabase(), session.user.id, input);
  },
});
```

For webhooks or REST APIs, export an Astro `APIRoute` handler and validate its payload before calling shared queries. Long-running, asynchronous, queue, Workflow, or Durable Object work belongs in `apps/data-service`, not in the website.

## Benefits of Centralized Queries

### 🔄 Code Reuse
Write database queries once and use them across multiple applications and services in your monorepo.

### 🛡️ Type Safety
Drizzle ORM provides full TypeScript support with compile-time type checking and excellent autocompletion.

### 🧪 Easier Testing
Centralized queries can be easily unit tested, ensuring your database logic is reliable and well-tested.

### 📦 Maintainability
Keep all database logic in one place, making it easier to update schemas and optimize queries as your application grows.

---

**Database Setup Complete!** Your application now has a fully configured serverless database with type-safe queries, centralized schema management, and reusable database operations across your monorepo.
