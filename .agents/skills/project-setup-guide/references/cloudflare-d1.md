# Cloudflare D1 provider path

Use this reference for Cloudflare D1.

## Provider state

- database engine: SQLite/D1
- Drizzle dialect: `sqlite`
- Drizzle driver: `d1-http`
- Better Auth provider: `sqlite`

## Environment variables

Tell the user to configure these names in `packages/data-ops/.env` without sharing their values:

```bash
CLOUDFLARE_DATABASE_ID="<From Cloudflare Dashboard>"
CLOUDFLARE_ACCOUNT_ID="<From Cloudflare Dashboard>"
CLOUDFLARE_D1_TOKEN="<Create in Cloudflare Dashboard>"
```

## Drizzle configuration

Use in `packages/data-ops/drizzle.config.ts`:

```typescript
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

## Better Auth CLI configuration

The project uses a local SQLite database for Better Auth CLI schema generation.

Use in `packages/data-ops/config/auth.ts`:

```typescript
import { createBetterAuth } from "../src/auth/setup";
import Database from "better-sqlite3";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

export const auth = createBetterAuth({
  database: drizzleAdapter(new Database("./config/test.sqlite"), {
    provider: "sqlite",
  }),
});
```

If `better-sqlite3` is missing and this CLI path requires it, install that exact dependency in `packages/data-ops` before rebuilding.


## Better Auth adapter compatibility

Use the Drizzle adapter import compatible with the installed Better Auth version. Current Better Auth documentation uses `@better-auth/drizzle-adapter`; preserve an existing working legacy import when the project is pinned to an older compatible API.

## Current Better Auth CLI option

Current Better Auth can generate a Drizzle schema with an explicit `sqlite` dialect without requiring a live database connection. If the repository's `generate-auth-drizzle-schema` script already uses or can safely use that mode, prefer updating the script instead of introducing a dummy database solely for schema generation.

Keep the local `better-sqlite3` CLI configuration above as a compatibility path when the project's existing scripts depend on loading the auth config and database adapter.
