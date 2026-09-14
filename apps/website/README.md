# Acadelead Astro website

`jd-astro-site` is the customer-facing Astro website. It runs on Cloudflare
Workers and uses the shared `@repo/data-ops` package for Drizzle and Better Auth.

Run workspace commands from the repository root:

```bash
pnpm run dev:website
pnpm build
pnpm typecheck
pnpm --filter jd-astro-site cf-typegen
```

The website uses Astro, React 19 islands, Tailwind CSS v4, shadcn/ui, Better
Auth, Polar, and PostHog. Pages live in `src/pages`, layouts in `src/layouts`,
Actions in `src/actions`, and reusable server-only logic in `src/server`.

Marketing and documentation pages are pre-rendered. Auth, app, and Polar routes
opt into on-demand rendering. Keep React hydration limited to interactive UI.

Cloudflare configuration is in `wrangler.jsonc`. The worker name is
`jd-astro-site`. Environment values are managed outside source control: never
copy secrets into documentation, and do not run deployment or database
migration commands as part of routine validation.

See the root `README.md`, `AGENTS.md`, and `docs/architecture/monorepo.md` for
the complete workspace workflow and architecture.
