# jd-astro-kit

A reusable pnpm monorepo starter for multi-page marketing sites and landing pages on Cloudflare.

## Architecture

- `apps/website` (`jd-astro-site`): Astro pages, React islands, Actions, authentication-facing logic, and user-triggered transactions.
- `apps/data-service` (`jd-data-service`): Cloudflare Worker APIs and the home for background, queue, Durable Object, Workflow, and long-running workloads.
- `packages/data-ops` (`@repo/data-ops`): shared Drizzle schemas, Neon database access, Better Auth setup, queries, and Zod schemas.

The default database path is Neon PostgreSQL through Drizzle's `neon-http` driver. Alternative relational provider examples remain intentional reference material.

## Setup

```bash
pnpm run setup
pnpm skills:sync
```

This installs all dependencies and builds required packages.

## Development

### All applications
```bash
pnpm dev
```

### Website
```bash
pnpm run dev:website
```

### Data Service
```bash
pnpm run dev:data-service
```

## Validation

```bash
pnpm typecheck
pnpm build
pnpm test
```

`pnpm test` runs the focused website tests for payment input validation and checkout polling state.

## Database helpers

```bash
pnpm pull-drizzle-schema
pnpm generate-auth-drizzle-schema
pnpm generate-drizzle-sql-output
```

Review generated schema and SQL artifacts. Apply database migrations manually.

## Deployment

### Website (Cloudflare)
```bash
pnpm run deploy:website
```

### Data Service
```bash
pnpm run deploy:data-service
```

See [AGENTS.md](AGENTS.md) for engineering conventions and [`.agents/project-setup-guide.md`](.agents/project-setup-guide.md) for provider setup.
