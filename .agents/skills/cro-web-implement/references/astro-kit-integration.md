# Astro Kit integration

Inspect `AGENTS.md` first.

Known baseline architecture:
- `apps/website`: Astro pages and layouts, React islands, Astro Actions, auth endpoints, and Polar UI;
- `packages/data-ops`: Neon/Drizzle shared data layer in the Neon variant;
- `apps/data-service`: separate Cloudflare worker for background/system workloads in the Neon baseline;
- Convex variant: use the repository's Convex backend package and generated API rather than creating Drizzle/Neon code.

Use existing skills when available:
- `frontend-skill` and `shadcn` for UI implementation;
- `implement-forms` for any full-stack lead form;
- `agent-browser` for runtime/browser verification;
- `web-quality-audit` for performance/accessibility/SEO;
- `blast-radius` for sensitive cross-cutting changes;
- `code-review` after implementation;
- `tdd`/`implement` when installed and appropriate.

Never deploy, migrate production data, or alter `.env` files unless explicitly authorized.
