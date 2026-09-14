# Cloudflare Queues Reference

Cloudflare Queues are a deferred extension point for `apps/data-service`; no queue bindings or consumers are active by default.

The previous scaffold PRD described an optional teaching workflow with shared Zod message contracts in `@repo/data-ops`, authenticated producer Astro Actions in `jd-astro-site`, queue consumers in `jd-data-service`, optional R2 event ingestion, KV-backed result polling, and a protected demo route. It also required explicit Wrangler bindings, least-privilege resource access, input validation, idempotent consumers, retry/dead-letter handling, and regenerated Worker types.

If this reference is implemented later:

1. Treat GitHub Issues or one intentionally selected local `.scratch/<feature>/spec.md` tracker as the single feature-spec source.
2. Configure queue, R2, and KV resources explicitly in each relevant `wrangler.jsonc`.
3. Keep queue consumption and AI/background processing in `jd-data-service`.
4. Keep user-triggered producer functions and protected UI in `jd-astro-site`.
5. Put reusable message schemas in `@repo/data-ops`.
6. Regenerate Worker types, validate locally, and provision production resources manually.

This document records the durable architecture intent only; it is not an active implementation plan and does not claim that any Cloudflare resources exist.
