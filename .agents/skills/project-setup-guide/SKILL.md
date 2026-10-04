---
name: project-setup-guide
description: Configure or repair the starter kit project setup for database access, Drizzle ORM, Better Auth, schema generation, dependencies, and related environment configuration. Use for initial setup, database-provider changes, auth setup, missing environment variables, schema generation, database connectivity failures, or data-layer build errors in packages/data-ops.
---

# Project setup guide

Configure the project's database and authentication so the user only needs to supply their own environment-variable values and perform explicitly manual external actions.

Preserve the repository's architecture and scripts. Do not replace project conventions with a generic implementation unless the existing path is missing or broken.

## Execution contract

Do the implementation work yourself. Do not stop at showing snippets or telling the user which source files to edit.

For the selected provider, inspect and update all applicable project code and configuration, including:

- `packages/data-ops/package.json` dependencies when required;
- `packages/data-ops/src/database/setup.ts` or the repository's equivalent database helper;
- `packages/data-ops/drizzle.config.ts`;
- `packages/data-ops/config/auth.ts`;
- `packages/data-ops/src/auth/server.ts`;
- generated Drizzle/Better Auth schema wiring;
- environment example/template files if they exist, but never `.env` itself.

Create missing provider wiring when necessary. Preserve unrelated behavior.

The user's normal manual work should be limited to:

1. entering their own environment-variable values;
2. completing provider-dashboard or OAuth setup when required;
3. reviewing and manually applying generated SQL;
4. testing the final application flow.

## Rules

- Work on data-layer setup inside `packages/data-ops/`.
- Run workspace scripts from the repository root unless the repository says otherwise.
- Never read, print, request, expose, or edit secret values in `.env` files.
- Tell the user which environment variable names to configure. Never ask for their values.
- Never run a database migration, `drizzle-kit migrate`, Better Auth migration command, or apply generated SQL.
- Preserve unrelated project configuration and user-authored files.
- Install only dependencies proven necessary for the selected provider path.
- Stop when verification fails. Diagnose the failure before continuing.
- Do not repeat a question the user has already answered.
- Once a provider is selected, stay on that provider path and ignore all other provider instructions.
- For PostgreSQL, treat `DATABASE_URL` and split credentials as equal supported connection options. Do not prefer one unless the user or existing project convention chooses it.

## Supported provider paths

The default provider path for a new setup is Neon -> PostgreSQL -> Drizzle ORM -> `neon-http` -> Better Auth `pg`.

| Provider | Engine | Reference |
| --- | --- | --- |
| Neon | PostgreSQL | `references/postgresql.md` |
| Supabase | PostgreSQL | `references/postgresql.md` |
| PlanetScale Postgres | PostgreSQL | `references/planetscale-postgresql.md` |
| PlanetScale Vitess | MySQL | `references/planetscale-mysql.md` |
| Cloudflare D1 | SQLite/D1 | `references/cloudflare-d1.md` |

If the provider is already known, use it without asking again. If it is unknown, ask the user to choose one supported provider. Use Neon only when the user asks for the default or recommended provider.

Load only the reference for the selected provider.

If the requested provider is outside this matrix, do not invent a configuration. Explain that this skill does not define that path.

## Workflow

### 1. Inspect before editing

Inspect the repository before changing anything.

Read:

- root workspace configuration and `package.json`;
- `packages/data-ops/package.json`;
- `packages/data-ops/drizzle.config.ts`;
- `packages/data-ops/config/auth.ts`;
- `packages/data-ops/src/database/setup.ts`;
- `packages/data-ops/src/auth/server.ts`;
- `packages/data-ops/src/drizzle/`;
- environment example/template files, if present.

Do not inspect `.env` contents.

Determine:

- current or requested provider;
- database engine;
- runtime driver;
- Drizzle dialect;
- Better Auth provider and installed adapter import path;
- existing workspace scripts;
- existing dependencies;
- existing provider-specific configuration;
- smallest required edit set.

For PostgreSQL, also determine the connection-variable mode:

- `DATABASE_URL`; or
- `DATABASE_HOST` + `DATABASE_USERNAME` + `DATABASE_PASSWORD`; or
- dual-mode support if the project should accept either without code changes.

For a new PostgreSQL setup, present both environment-variable modes as equal options. Do not silently choose one for the user.

This phase is complete when exactly one supported provider path is selected and the required changes are known.

### 2. Make the repository provider-ready

Read the selected provider reference and implement its required project wiring.

Update dependencies only when required. For example, a Neon `neon-http` runtime requires `@neondatabase/serverless` in addition to the project's Drizzle packages.

Update the database helper so the selected provider and chosen environment-variable mode are actually usable by both CLI and runtime code.

For PostgreSQL, install dual-mode code when it fits the existing architecture and the user wants both options: accept `DATABASE_URL` when present, otherwise construct a connection string from the split variables. Treat both environment modes as equal supported choices.

Update environment example/template files with variable names and placeholders if such files exist. Never write real secret values.

Do not pause after these repository edits unless user input is required.

### 3. Environment gate

Tell the user exactly which environment variable names they may fill for the selected provider.

For PostgreSQL, if dual-mode support was installed, explain that they can configure either:

```bash
DATABASE_URL="postgresql://username:password@hostname.com:5432/database-name?sslmode=require"
```

or:

```bash
DATABASE_HOST="hostname.com:5432/database-name"
DATABASE_USERNAME="username"
DATABASE_PASSWORD="password"
```

Do not require both modes.

Better Auth also requires:

```bash
BETTER_AUTH_SECRET="your-secret-key-here"
```

Generate a secret with either of these supported methods:

```bash
npx auth@latest secret
```

or:

```bash
openssl rand -base64 32
```

Do not prefer one if the repository already defines its own equivalent command.

Only when Google sign-in is requested, also require:

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Never ask the user to paste any secret value into the conversation.

Pause until the user confirms that one complete database connection mode plus the required auth variables are configured.

### 4. Configure Drizzle and verify connectivity

Apply only the selected provider's Drizzle configuration from its reference to `packages/data-ops/drizzle.config.ts`.

Preserve unrelated project settings. Remove stale settings that belong to another provider.

Run from the workspace root:

```bash
pnpm run pull-drizzle-schema
```

Treat this command as database introspection, not as a harmless network ping.

If it fails, stop and diagnose the failure before continuing. Classify the cause when possible as:

- missing environment configuration;
- invalid credentials;
- network or provider access failure;
- driver/provider mismatch;
- Drizzle configuration error.

Do not continue until the selected provider configuration is coherent and introspection succeeds.

### 5. Configure Better Auth CLI and build

Apply the selected provider's Better Auth CLI configuration from its reference to `packages/data-ops/config/auth.ts`.

Use the adapter import supported by the installed Better Auth version. Preserve a working existing import. For current Better Auth packages, use `@better-auth/drizzle-adapter` when that package is installed or required by the project.

This auth instance is for Better Auth CLI and schema generation. Do not treat it as the application's runtime auth instance.

Run:

```bash
pnpm run build:data-ops
```

If a dependency is missing:

1. identify the exact package;
2. confirm that the selected provider path requires it;
3. install it in `packages/data-ops`;
4. rerun the build.

If the error is TypeScript or configuration related, fix the configuration instead of installing unrelated packages.

Do not continue until the build succeeds.

### 6. Generate and inspect the auth schema

Use the repository's existing command first:

```bash
pnpm run generate-auth-drizzle-schema
```

Inspect:

`packages/data-ops/src/drizzle/auth-schema.ts`

Verify that:

- the file exists;
- imports match the selected database engine;
- column types match the selected Drizzle dialect;
- no stale schema from another provider remains.

Do not hand-write a replacement schema to bypass a failing generator.

If the existing script cannot generate because it unnecessarily requires a live database connection, Better Auth's current CLI supports Drizzle schema generation with an explicit adapter and dialect. Adapt the project script deliberately rather than running a migration.

When the installed Better Auth CLI supports schema checking, validate the generated Drizzle schema with `check schema` using the project auth config. This check is additive and must not apply migrations.

Continue only when generation succeeds and the output matches the selected provider.

### 7. Generate SQL and stop for manual application

Run:

```bash
pnpm run generate-drizzle-sql-output
```

Inspect the generated `.sql` file under `packages/data-ops/src/drizzle/`.

Confirm that it contains the expected Better Auth table creation statements for the selected engine.

If generation fails, diagnose the cause before deleting anything. Check for:

- provider mismatch;
- incompatible generated schema;
- migration metadata conflict;
- malformed Drizzle configuration;
- missing dependency;
- generated-output collision.

Do not delete metadata or SQL files as a generic recovery step.

Remove only generated artifacts proven to cause the failure. Never delete user-authored SQL or unrelated database files.

Do not run or apply the generated SQL.

Tell the user where the SQL file is, ask them to review and execute it with their own database tooling, then pause until they confirm completion.

### 8. Verify runtime auth

Inspect and update:

`packages/data-ops/src/auth/server.ts`

Confirm that runtime auth:

- imports the generated `drizzle/auth-schema`;
- passes the correct schema to the Drizzle adapter;
- uses the selected database helper/provider;
- supports the selected PostgreSQL connection-variable mode when applicable;
- contains no stale provider-specific configuration.

Fix the code yourself. Do not merely tell the user what to change.

Run again:

```bash
pnpm run build:data-ops
```

Do not continue to application testing while this build is failing.

### 9. Hand off website environment configuration

Tell the user which database and Better Auth environment variable names must also be available to the website/runtime.

Do not copy values from `packages/data-ops/.env` and do not edit the website `.env` file.

If the repository has a website environment example/template file, update its variable names/placeholders automatically.

Ask the user to configure the real values themselves.

Then have them test:

- application startup without environment errors;
- sign-up or sign-in;
- user record creation or retrieval;
- session creation;
- session persistence after refresh;
- one authenticated database-backed request;
- requested OAuth provider, if configured.

## Human gates

Pause only when:

1. the provider cannot be determined;
2. a new PostgreSQL setup requires the user to choose URL, split credentials, or dual-mode support;
3. the user must configure environment-variable values or an external provider setting;
4. generated SQL is ready for manual review and application.

Do not pause between safe repository edits, dependency installation, builds, generation steps, or verification commands.

## Definition of done

Do not claim setup is complete until all applicable conditions are true:

- exactly one supported provider is configured;
- all required provider code, dependencies, and configuration have been added by the agent;
- the user only needs to provide their own secret/environment values and explicit external actions;
- required environment variables are confirmed by the user;
- PostgreSQL supports the selected URL/split/dual connection mode;
- Drizzle matches the provider and database introspection succeeds;
- Better Auth CLI configuration matches the database engine;
- `auth-schema.ts` is generated for the correct dialect;
- SQL is generated and manually applied by the user;
- runtime auth uses the generated schema and selected provider;
- `pnpm run build:data-ops` succeeds;
- website/runtime environment variables are configured;
- authentication works end to end.

## Final report

Report:

- selected provider and database engine;
- PostgreSQL connection-variable mode, when applicable;
- files changed;
- dependencies added or changed;
- commands run;
- generated schema path;
- generated SQL path;
- build and verification result;
- manual actions completed by the user;
- unresolved work.

Never include secret values.
