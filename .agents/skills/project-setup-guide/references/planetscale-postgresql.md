# PlanetScale PostgreSQL provider path

Use this reference for PlanetScale Postgres.

## Provider state

- database engine: PostgreSQL
- Drizzle dialect: `postgresql`
- Better Auth provider: `pg`

PlanetScale Postgres is distinct from PlanetScale Vitess/MySQL. Do not apply the MySQL provider path to a Postgres database.

## Environment variables

Use a standard PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://username:password@hostname:port/database-name?sslmode=require"
```

If the existing project already uses split PostgreSQL credentials and the PlanetScale connection can be represented by them, the PostgreSQL split mode may also be retained. Do not force a connection-mode rewrite without need.

## Runtime driver

Preserve a working PostgreSQL runtime driver already present in the project.

PlanetScale Postgres supports standard PostgreSQL clients. It also supports the Neon serverless driver, including HTTP mode on current PlanetScale Postgres. Only configure a serverless driver when the project's runtime benefits from it and the required endpoint configuration is implemented correctly.

Do not assume Neon-specific defaults solely because the Neon serverless package is used.

## Drizzle configuration

Use PostgreSQL Drizzle Kit configuration with the selected connection string:

```typescript
import type { Config } from "drizzle-kit";

const config: Config = {
  out: "./src/drizzle",
  schema: ["./src/drizzle/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["!_cf_KV", "!auth_*"],
};

export default config satisfies Config;
```

## Better Auth

Use Better Auth's Drizzle adapter with provider `pg` and the project's PostgreSQL database helper.

Use the adapter import compatible with the installed Better Auth version. Current Better Auth documentation uses `@better-auth/drizzle-adapter`.

## Verification

Use the common workflow in `SKILL.md`: build, introspect, generate Better Auth schema, generate SQL, require manual SQL application, then verify runtime auth.
