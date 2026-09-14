# Neon / Drizzle adapter

Use this when the repository's active backend is the Neon baseline.

Known Astro Kit boundaries:
- `apps/website`: Astro Actions and UI;
- `packages/data-ops`: shared Drizzle schemas, clients and queries;
- Neon uses PostgreSQL through the repository's server-side connection/driver.

## Target implementation

- keep PostgreSQL as the source of persistent relational truth for this variant;
- declare `lead_submissions` in the repository's real Drizzle schema;
- create a real migration through the project's approved Drizzle migration workflow;
- keep runtime requests free of DDL/schema mutation;
- implement typed insert/get-by-event-id operations in the shared data layer;
- implement `lead_deliveries` if delivery tracking is in scope;
- keep the canonical payload mapping in one reusable server module;
- keep dynamic client form/quiz context in `payload_json` rather than adding client-specific columns;
- resolve the existing PostgreSQL connection binding before introducing a new `DATABASE_URL` name;
- read `references/environment-contract.md` and emit an Environment Delta for new or migrated forms.

## Environment boundary

The PostgreSQL connection string is server-only and secret. The browser never receives it.

When the repository uses Cloudflare Worker secrets, keep the DB connection and the resolved form-specific n8n webhook secret at the Worker/server boundary. Do not put sensitive values in public runtime variables or Wrangler `vars`.

Preserve existing `.env` files byte-for-byte unless the user explicitly authorizes edits.

## Migration from legacy runtime-DDL code

If runtime `ensure*Table()` DDL exists, do not copy that pattern into new work. Model the durable schema first, then plan a safe Drizzle migration. Preserve production behavior until replacement is tested.

Do not run a migration or deploy without explicit approval. It is valid to generate migration files and stop for approval.
