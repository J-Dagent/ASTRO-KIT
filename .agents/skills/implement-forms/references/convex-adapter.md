# Convex adapter

Use this when the repository is the Convex variant. Keep the logical `FormDefinition`, `CanonicalLeadSubmission`, attribution object, n8n contract and browser behavior identical to the Neon variant while implementing persistence according to Convex's document/function model.

## Invariants

- do not introduce Neon, PostgreSQL, Drizzle, `DATABASE_URL`, SQL migrations or SQL-shaped repository abstractions into the Convex variant;
- use the repository's canonical Convex schema, validators, functions and deployment conventions;
- represent canonical queryable lead fields as validated top-level document fields and keep dynamic form/attribution/consent/technical data as validated nested objects;
- define indexes around actual Convex query/idempotency patterns, especially `event_id`, rather than mechanically recreating SQL indexes;
- implement delivery state as a separate Convex table when in scope;
- use Convex validators for backend inputs and keep frontend Zod where it serves form UX/domain validation;
- prefer current official Convex patterns already supported by the repository rather than hard-coding stale APIs.

## Environment variables

Read `references/environment-contract.md` before changing runtime configuration.

When Convex functions own server-side integrations, prefer declaring expected environment variables in `convex/convex.config.ts` for type-safe access and deployment-time validation when supported by the active Convex version/repository, then set actual values per deployment through the approved Convex environment mechanism.

Keep `CONVEX_DEPLOY_KEY` as a CI/deploy secret only. Treat `CONVEX_DEPLOYMENT` as deployment-selection configuration, not a business secret. Resolve the browser-facing Convex URL from the existing framework setup instead of inventing a parallel variable.

## Trusted server boundary

The form pipeline still requires a trusted server boundary for request-derived context such as client IP and user-agent.

If the existing Astro/Cloudflare Astro Action remains the intake boundary, enrich there and call the repository's supported Convex server API/client. Keep n8n and IP-hash secrets at Cloudflare if that boundary owns those operations.

If the approved architecture instead uses a Convex HTTP action as the intake boundary, obtain request-derived context there and place the required secrets in the Convex deployment environment.

Never move authoritative IP collection into a browser hidden field. Do not change the intake boundary solely for stylistic consistency; preserve the simplest tested architecture that satisfies the canonical contract.
