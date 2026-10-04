# PostgreSQL provider path

Use this reference for Neon and Supabase PostgreSQL setups supported by this project.

## Provider state

For both providers:

- database engine: PostgreSQL
- Drizzle dialect: `postgresql`
- Better Auth provider: `pg`

For a new Neon setup, use the project's default `neon-http` runtime path when the repository does not already define another supported PostgreSQL driver.

For Supabase, preserve the repository's supported runtime connection mode and driver. Do not silently apply Neon-specific runtime configuration.

If the user selects Supavisor transaction mode, use the connection string copied from the Supabase dashboard. Transaction mode uses port `6543` and does not support prepared statements. When the runtime uses Postgres.js/Drizzle through that mode, configure the client with `prepare: false`. Do not apply this setting to Neon or to Supabase direct/session connections without reason.

## PostgreSQL environment-variable modes

Support both modes as first-class options. Do not prefer one merely because it appears first here.

### Option A: connection URL

```bash
DATABASE_URL="postgresql://username:password@hostname.com:5432/database-name?sslmode=require"
```

For Neon, tell the user to copy the connection string from Neon and use it as provided. Neon connection strings may include additional parameters such as `channel_binding=require`.

### Option B: split credentials

```bash
DATABASE_HOST="hostname.com:5432/database-name"
DATABASE_USERNAME="username"
DATABASE_PASSWORD="password"
```

Do not require `DATABASE_URL` when the user chooses split credentials. Do not require split credentials when the user chooses `DATABASE_URL`.

## Dual-mode connection resolution

When the existing architecture allows it, configure PostgreSQL code once so either environment mode works without another source-code change.

Use the equivalent of:

```typescript
function getPostgresUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DATABASE_HOST;
  const username = process.env.DATABASE_USERNAME;
  const password = process.env.DATABASE_PASSWORD;

  if (!host || !username || !password) {
    throw new Error(
      "Configure DATABASE_URL or DATABASE_HOST + DATABASE_USERNAME + DATABASE_PASSWORD",
    );
  }

  return `postgresql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}`;
}
```

Place this logic in the project's existing database/config helper when possible rather than scattering it through runtime files.

Do not read the actual values yourself.

## Neon runtime with `neon-http`

Ensure `@neondatabase/serverless` is installed when the runtime uses Neon HTTP.

Use the project's database helper, but make it resolve the selected PostgreSQL connection mode and initialize Drizzle with Neon HTTP. A current minimal form is:

```typescript
import { drizzle } from "drizzle-orm/neon-http";

export function initDatabase() {
  return drizzle(getPostgresUrl());
}
```

If the project's existing `initDatabase` accepts arguments, preserve that public API when practical. Extend it to accept a URL as well as split credentials instead of forcing all callers to change unnecessarily.

For example:

```typescript
type PostgresDatabaseConfig =
  | { url: string }
  | { host: string; username: string; password: string };

function resolvePostgresUrl(config: PostgresDatabaseConfig) {
  if ("url" in config) return config.url;

  return `postgresql://${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@${config.host}`;
}
```

Then initialize the existing Drizzle driver with the resolved URL.

## Drizzle configuration

Configure `packages/data-ops/drizzle.config.ts` so it accepts either PostgreSQL environment mode when dual-mode support is desired:

```typescript
import type { Config } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ?? (() => {
  const host = process.env.DATABASE_HOST;
  const username = process.env.DATABASE_USERNAME;
  const password = process.env.DATABASE_PASSWORD;

  if (!host || !username || !password) {
    throw new Error(
      "Configure DATABASE_URL or DATABASE_HOST + DATABASE_USERNAME + DATABASE_PASSWORD",
    );
  }

  return `postgresql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}`;
})();

const config: Config = {
  out: "./src/drizzle",
  schema: ["./src/drizzle/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  tablesFilter: ["!_cf_KV", "!auth_*"],
};

export default config satisfies Config;
```

If the user chose only one connection mode and the project intentionally does not need dual-mode support, simplify this configuration to that mode.

## Better Auth CLI configuration

Keep the project's existing `createBetterAuth` and `initDatabase` abstractions.

Configure `packages/data-ops/config/auth.ts` to initialize the same database helper with whichever PostgreSQL mode is configured. With an `initDatabase` API supporting both forms, use logic equivalent to:

```typescript
import { createBetterAuth } from "../src/auth/setup";
import { initDatabase } from "../src/database/setup";

const db = process.env.DATABASE_URL
  ? initDatabase({ url: process.env.DATABASE_URL })
  : initDatabase({
      password: process.env.DATABASE_PASSWORD!,
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
    });

export const auth = createBetterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
```

Use the Drizzle adapter import compatible with the installed Better Auth version. Current Better Auth documentation uses `@better-auth/drizzle-adapter`; preserve an existing working import when the project is pinned to an older compatible API.

## Runtime auth

Ensure `packages/data-ops/src/auth/server.ts` uses the same provider-aware database helper and generated `auth-schema`.

Do not leave CLI-only database code in the runtime auth server.

## Completion check

For a Neon `neon-http` setup, verify that the final repository has all required code and dependencies before asking the user for anything beyond environment values:

- `@neondatabase/serverless` installed when required;
- `drizzle-orm/neon-http` used by the Neon runtime path;
- `DATABASE_URL`, split credentials, or dual-mode resolution wired into the database helper;
- `drizzle.config.ts` wired to the same selected mode;
- Better Auth CLI wired to the database helper with provider `pg`;
- runtime auth wired to the generated schema;
- environment example/template files updated if present.
