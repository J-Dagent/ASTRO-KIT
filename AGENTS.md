# Repository Instructions

## Branch and PR Workflow

Use `staging` as the integration branch. Start feature branches from the latest `staging`; isolated worktrees may live under `.worktrees/<branch-name>`. Keep PRs small and reviewable, target `staging`, and keep unrelated features on separate branches. After a dependency merges, update active branches from `staging`. Promote `staging` to `main` only for releases.

## Repository Architecture

This is a pnpm monorepo with three intentional boundaries:

- `apps/website`: `jd-astro-site`, the Astro website. It owns marketing pages, React islands, Astro Actions, site endpoints, authentication-facing UI, and the Polar checkout experience.
- `apps/data-service`: `jd-data-service`, a separate Hono Cloudflare Worker for independent APIs, shared webhooks, background processing, future queues, Durable Objects, Workflows, WhatsApp, AI agents, and long-running or asynchronous workloads.
- `packages/data-ops`: `@repo/data-ops`, the reusable data layer. It owns Drizzle schemas, database clients, Better Auth setup, shared queries, and shared Zod schemas.

New pages belong in `apps/website/src/pages`; use `.astro` for pages, layouts, and composition. Hydrate React only for browser interaction or client state. Use Astro Actions for site-initiated mutations and Astro endpoints for auth, callbacks, and site-owned HTTP handlers. Marketing pages stay pre-rendered by default; opt individual routes into on-demand rendering when they need sessions, cookies, or server-only work.

Keep `packages/data-ops` framework-agnostic. It must not import `astro:*`, React, Hono, or `cloudflare:workers`. Add React Query or another global state manager only after demonstrating a project need.

Demo and example files are intentional teaching/reference material in the template. Do not remove them unless explicitly requested.

Downstream applications created from this template may remove demo UI and examples once equivalent production implementations exist.

## Commands

Run commands from the repository root unless stated otherwise.

```bash
pnpm run setup
pnpm run build:data-ops
pnpm run dev:website
pnpm run deploy:website
pnpm run dev:data-service
pnpm run deploy:data-service

pnpm dev
pnpm build
pnpm typecheck
pnpm test

pnpm pull-drizzle-schema
pnpm generate-auth-drizzle-schema
pnpm generate-drizzle-sql-output
pnpm skills:sync
```

`pnpm test` runs the focused website tests. Add tests at public seams when risky behavior changes; do not infer broader coverage than the suites actually provide. Deployment commands are documented for users but must be run only when deployment is explicitly requested.

## Database

The default path is Neon → PostgreSQL → Drizzle ORM → `drizzle-orm/neon-http` → Better Auth PostgreSQL. Provider flexibility is intentional: documented PlanetScale, Supabase, Cloudflare D1, SQLite-compatible, and other relational paths are alternatives, not simultaneously active defaults. Never run migrations or destructive database operations without explicit authorization.

## Source Inspection

When dependency source inspection is needed, fetch only the relevant package or repository with `npx opensrc`. Do not assume `opensrc/` is populated.

```bash
npx opensrc <package>
npx opensrc pypi:<package>
npx opensrc crates:<package>
npx opensrc <owner>/<repo>
```

## Web Tooling

Use the lightest reliable tool.

- Claude Code: use `WebFetch` for straightforward public page retrieval.
- OpenCode: use `webfetch` for direct public retrieval and `websearch` for search when available.
- Codex: use native `web_search` for web research/search; Codex has no tool named `WebFetch`.
- Cross-platform: use `agent-browser` for dynamic or client-rendered sites, interaction, authentication, stateful navigation, browser workflows, or when native fetch/search is insufficient.

## Documents and PDFs

Use the `anydoc` skill for ordinary text extraction from supported documents, including text-readable PDFs. For large documents, write Markdown to disk and read only the relevant sections.

Use the `pdf-inspector` skill for PDF classification, scanned or mixed detection, OCR diagnosis, or incomplete extraction. Prefer structured classification, compact Markdown, and page selection when they reduce unnecessary context.

Do not classify every PDF before ordinary AnyDoc conversion. Use `pdftotext` only as a plain-text fallback when the normal document tools fail.

Use visual page inspection when the task depends on images, charts, diagrams, or layout. Prefer local parsing and OCR by default.

## Task Delegation

Delegate only when context isolation, parallelism, or throughput materially benefit. Choose a lightweight model for mechanical work, a balanced model for scoped research or synthesis, and the strongest reasoning model for difficult tradeoffs. Avoid host-specific model names in durable instructions. The parent owns final synthesis and validation.

## Skill Architecture

`.agents/skills/` is the canonical physical source for project skills. `.claude/skills/` contains relative symlinks only. After adding or removing skills, run `pnpm skills:sync`.

Plans produced by `improve` and `improve-animations` belong in `plans/`. Internal durable knowledge belongs in `docs/`; application-rendered technical documentation belongs in `apps/website/public/docs/` and remains in English.

## CTO/CRO Routing

Start from the request's current maturity and invoke only the minimum skills required:

- Undiagnosed CRO problem: `cro-experience-audit`.
- Approved CRO recommendation without an implementation contract: `cro-delivery-spec`.
- Ready `CONVERSION_IMPLEMENTATION_CONTRACT`: `cro-web-implement`.
- Form-specific work: `implement-forms`; compose it with `cro-web-implement` when that implementation includes a form.
- Completed implementation or QA-only request: `cro-web-validate`.

Do not redo a `READY` decision, rerun an audit when a validated CRO decision exists, or regenerate a spec when a valid implementation contract exists. `implement-forms` is conditional, not a required stage. After CRO implementation, run `cro-web-validate`. Skills are capabilities; this file owns routing. Add no skill when this section can route the work.

## Definition of Done

Run relevant executable validation: typecheck, build, real tests when they exist, and blast-radius or review checks when appropriate. Preserve existing `.env` files byte-for-byte. Do not claim success from static reasoning when executable checks exist.
