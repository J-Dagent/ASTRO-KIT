# Plan: Cloudflare Workers compatibility dates

Status: ready to execute; deployment steps need explicit user approval. Prepared 2026-11-11 on top of `chore/deps-p3-minor`.

## Current state

| Worker | `compatibility_date` | Flags |
|---|---|---|
| `apps/data-service` | `2025-04-01` | `nodejs_compat` |
| `apps/website` | `2025-09-02` | `nodejs_compat` |

- Wrangler is 4.160.0 (workerd `1.20261110.1`, which reports `2026-11-10` as its build date).
- `apps/*/worker-configuration.d.ts` were generated with workerd `1.20260820.1` and are stale relative to the installed Wrangler.
- `@astrojs/cloudflare` 14.x only requires `nodejs_compat` with a date ≥ 2024-09-23, so both dates are valid. Cloudflare recommends keeping dates current.

## Target

**`2026-11-10`** for both Workers: the newest date the installed workerd supports.

Do not go past it for now. On **2026-11-17**, these become default: `enable_request_signal`, `pipe_to_backward_propagation` (streams), `new_module_registry` (stricter import/require), `cache_option_preserves_cache_control`. They deserve their own step later.

## Flags that change behavior, with likely impact on this stack

Source: [compatibility flags](https://developers.cloudflare.com/workers/configuration/compatibility-flags/). Dates are verified; impact is a hypothesis to confirm by testing.

**data-service only** (between 2025-04-01 and 2025-09-02):
- `bind_asynclocalstorage_snapshot_to_request` (2025-06-16)
- `enable_nodejs_http_modules` (2025-08-15): libraries may switch from fetch to `node:http`
- `expose_global_message_channel` (2025-08-15)
- `strip_authorization_on_cross_origin_redirect` (2025-09-01)
- `remove_nodejs_compat_eol` (2025-09-01)

**Both Workers** (after 2025-09-02):
- `enable_nodejs_process_v2`, `enable_nodejs_fs_module`, `enable_nodejs_os_module` (2025-09-15): libraries that feature-detect Node (better-auth, posthog-node, Polar SDK, Vite output) may take different code paths.
- `require_returns_default_export` (2026-01-22): CommonJS `require()` semantics.
- `enable_nodejs_global_timers` (2026-02-10): `setTimeout` returns a Node `Timeout` object.
- `encoder_stream_spec_compliant_backpressure`, `writable_stream_spec_compliant_writer` (2026-03-24): React/Astro streaming SSR.
- `diagnostics_channel_has_subscribers_getter` (2026-05-19): instrumentation libraries.
- `fetch_iterable_type_support` (2026-01-15 / 2026-02-19), `enable_fast_jsg_struct` (2025-12-03): low impact.

## Steps

1. Branch from `staging` (after the dependency lots merge). Change **one Worker at a time**: data-service first (smaller surface), then website.
2. data-service: set `compatibility_date` to `2026-11-10` in `apps/data-service/wrangler.jsonc`. Regenerate types with `pnpm --filter jd-data-service cf-typegen`. Run `pnpm typecheck` and `pnpm build`, then `pnpm dev:data-service` and request `/`.
3. website: same change in `apps/website/wrangler.jsonc`. Regenerate types with `pnpm --filter jd-astro-site cf-typegen`. Run `pnpm typecheck`, `pnpm build`, `pnpm test`.
4. Local runtime check with `pnpm --filter jd-astro-site serve` (production build on workerd):
   - pages `/`, `/docs`, `/app`;
   - Google sign-in and sign-out (Better Auth);
   - Polar sandbox pricing, checkout and portal;
   - PostHog events;
   - Neon queries;
   - streaming SSR output.
5. If a regression appears, bisect with an intermediate date (for example `2026-03-23`, just before the stream flags) to isolate the flag. Opt out with `no_*` flags only as a documented, temporary measure.
6. **With approval only:** `wrangler versions upload` for a non-deployed version, test it, then `wrangler versions deploy` with a gradual split (10% → 50% → 100%) while watching observability logs.
7. Rollback: `wrangler rollback <version-id>` (or Dashboard → Deployments), or revert the date and redeploy. No data is involved.

## Adapter-provisioned bindings

`@astrojs/cloudflare` 14.x enables Cloudflare Images (`IMAGES`) and KV sessions (`SESSION`) by default. Wrangler auto-provisions them on deploy, so they do not need to be declared in `wrangler.jsonc`. Disable them with `session: false` or `imageService` in the Astro config if the template should not create them. This is independent of the date bump, but worth confirming before the first deploy.

## Done when

Both Workers run on `2026-11-10` with regenerated types, all checks pass, and the manual runtime checklist passes on a preview version.
