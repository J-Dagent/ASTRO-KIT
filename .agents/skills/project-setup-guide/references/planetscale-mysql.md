# PlanetScale Vitess/MySQL provider path

Use this reference for the PlanetScale Vitess/MySQL path supported by this project.

## Provider state

- database engine: MySQL
- Drizzle dialect: `mysql`
- Better Auth provider: `mysql`

Do not silently switch this path to PlanetScale PostgreSQL. If the project uses PlanetScale PostgreSQL, this skill does not define that provider path and must be updated deliberately.

## Environment variables

Tell the user to configure these names in `packages/data-ops/.env` without sharing their values:

```bash
DATABASE_HOST="hostname.com/database-name"
DATABASE_USERNAME="username"
DATABASE_PASSWORD="password"
```

## Drizzle configuration

Use in `packages/data-ops/drizzle.config.ts`:

```typescript
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

## Better Auth CLI configuration

Use in `packages/data-ops/config/auth.ts`:

```typescript
import { createBetterAuth } from "../src/auth/setup";
import { initDatabase } from "../src/database/setup";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

export const auth = createBetterAuth({
  database: drizzleAdapter(
    initDatabase({
      password: process.env.DATABASE_PASSWORD!,
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
    }),
    {
      provider: "mysql",
    },
  ),
});
```

Keep the project's existing `initDatabase` API and runtime database helper unless a deliberate PlanetScale-specific adjustment is required.


## Better Auth adapter compatibility

Use the Drizzle adapter import compatible with the installed Better Auth version. Current Better Auth documentation uses `@better-auth/drizzle-adapter`; preserve an existing working legacy import when the project is pinned to an older compatible API.
