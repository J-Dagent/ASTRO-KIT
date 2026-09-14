# Monorepo Architecture

`jd-astro-kit` preserves three deployment and ownership boundaries.

## Website

`apps/website` is the Astro website and Cloudflare Worker named `jd-astro-site`. It owns pre-rendered marketing pages, on-demand app and auth routes, React islands, Astro Actions, site endpoints, payments, and user-triggered transactions. Request-scoped server helpers create database and auth dependencies explicitly from Cloudflare bindings.

## Data service

`apps/data-service` is the independent Cloudflare Worker named `jd-data-service`. It is intentionally separate so APIs, background jobs, future queues, Durable Objects, Workflows, and long-running work do not accumulate inside the user-facing application.

## Shared data layer

`packages/data-ops` is published inside the workspace as `@repo/data-ops`. It contains Drizzle schemas and database clients, Better Auth setup, reusable queries, and shared Zod contracts. It remains framework-agnostic.

## Rendering and request flow

Astro pre-renders marketing and documentation pages. Routes under `/app`, Better Auth endpoints, and Polar endpoints opt into on-demand rendering. Browser mutations cross Astro Actions, which validate input and authorize the request before calling server helpers. Independent APIs, webhooks, queues, workflows, and background jobs stay in `apps/data-service`.

## Default database path

The default runtime path is Neon → PostgreSQL → Drizzle ORM → `drizzle-orm/neon-http` → Better Auth's PostgreSQL adapter. PlanetScale, Supabase, Cloudflare D1, SQLite-compatible, and other relational examples are alternative provider paths, not simultaneously active infrastructure.
