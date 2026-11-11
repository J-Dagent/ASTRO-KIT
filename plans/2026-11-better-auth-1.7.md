# Plan: Better Auth 1.6.34 → 1.7.20

Status: done on `feat/better-auth-1.7` (2026-11-11), except step 1 (duplicate check on real data) and step 6 (Google sign-in on staging), which need database access and a deployment. Offline `auth generate` produced a schema identical to `auth-schema.ts`, so there is no migration. Prepared 2026-11-11 on top of `chore/deps-p3-minor`.
Executor constraints: never run a database migration or deploy without explicit user approval (AGENTS.md).

## Why

`pnpm audit` keeps one critical and two high Better Auth advisories that have no 1.6.x backport:

| Advisory | Fixed in | Applies to this repo? |
|---|---|---|
| GHSA-965c-763c-88jm: OAuth state usable as a magic link (critical) | 1.7.7 | No: requires the Magic Link plugin |
| GHSA-r4xp-prcw-77qf: OAuth Proxy sign-in as another user | 1.7.7 | No: requires the OAuth Proxy plugin |
| GHSA-q84f-53jg-9ppm: device approval hides requesting client | 1.7.0-rc.3 | No: requires `deviceAuthorization()` |
| GHSA-44jh-23m7-hpcf: Drizzle rate-limit race | 1.7.7 | No: only with `rateLimit.storage: "database"` |
| GHSA-9hm7-xhfp-cx58: OAuth `email_verified` trust | 1.7.16 | Low for Google |
| GHSA-fvxx-76fc-893x: cookie cache / secondary storage | 1.7.16 | Low |

The current setup (Google social login only, no plugins) is not exploitable. The template still ships these advisories to downstream projects that enable plugins, so the target is **1.7.20** (≥ 1.7.16, and never 1.7.0–1.7.2).

## Current usage

- `packages/data-ops/src/auth/setup.ts`: `betterAuth()` with the Drizzle adapter, custom model names (`auth_user`, `auth_session`, `auth_account`, `auth_verification`), email/password disabled, Google social provider, and `trustHost: true`.
- `packages/data-ops/src/drizzle/auth-schema.ts`: Drizzle pg schema (`auth_account.account_id`, timestamp columns).
- `apps/website/src/server/auth.ts`, `apps/website/src/pages/api/auth/[...all].ts`, `apps/website/src/lib/auth-client.ts` (`signIn.social`, `signOut`, `useSession`).
- Docs: `apps/website/public/docs/authentication.md`.

## Breaking changes that apply

Source: [1.7 upgrade guide](https://better-auth.com/docs/guides/1-7-upgrade-guide), [1.7 announcement](https://better-auth.com/blog/1-7).

- **Schema: unchanged from 1.6.** No column to add. Early 1.7 release candidates renamed `accountId` and required `issuer`; the final guide does not. `issuer` (NOT NULL plus a unique index) existed only in 1.7.0–1.7.2 and was removed in 1.7.3, so a database coming from 1.6.34 needs nothing.
- **Google callback URL: unchanged** (`/api/auth/callback/google`). Only generic OAuth moved from `/api/auth/oauth2/callback/:id` to `/api/auth/callback/:id`.
- **Client API:** `signIn.social`, `signOut` and `useSession` are not renamed.
- **Behavior:** token exchanges refuse HTTP redirects. Dynamic base URLs fail closed, which only matters with `baseURL.allowedHosts`. The Drizzle adapter throws when the affected-row count is invalid.
- **Renames that do not apply here:** `experimental.joins` → `advanced.database.joins`; `getIp` → `getIP`.
- **Not applicable:** oidcProvider (→ `@better-auth/oauth-provider`), MCP, SCIM, SSO/SAML, two-factor, magic link, email OTP, device authorization, OAuth Proxy.

## Steps

1. **Pre-flight duplicate check (read-only, on staging data).** Ask the user to run this, or get explicit approval before running it:
   ```sql
   SELECT provider_id, account_id, count(*)
   FROM auth_account
   GROUP BY 1, 2
   HAVING count(*) > 1;
   ```
   It must return no rows.
2. **Remove the dead `trustHost: true` option** from `packages/data-ops/src/auth/setup.ts`. It exists in neither 1.6.34 nor 1.7.20 (no match in the published tarballs), so it is silently ignored today. The project already passes an explicit `baseURL`. Only if a proxy-derived base URL is ever needed, the real option is `advanced.trustedProxyHeaders`.
3. **Bump** `better-auth` to `1.7.20` in `apps/website/package.json` and `packages/data-ops/package.json`, and `auth` (CLI) to `1.7.20` in `packages/data-ops/package.json`. Peers are already satisfied: drizzle-orm 0.45.4, drizzle-kit 0.31.11, zod 4.6.7. The CLI needs Node ≥ 22.12, which `.nvmrc` 26 and `engines` ≥ 22.23.4 cover.
4. `pnpm install`, then `pnpm build:data-ops`, `pnpm typecheck`, `pnpm build`, `pnpm test`, `pnpm audit`. Expect no remaining Better Auth advisories.
5. **Schema diff:** run `pnpm generate-auth-drizzle-schema` with staging credentials in `packages/data-ops/.env` (never overwrite an existing `.env`). Expect an empty or near-empty diff in `auth-schema.ts`. If it is non-empty, run `pnpm generate-drizzle-sql-output`, review the SQL with the user, and **do not apply it** without approval.
6. **Manual check on a staging deployment** (deployment needs approval): Google sign-in, sign-out, session persistence across reloads, and an existing session surviving the upgrade. Confirm the Google Cloud redirect URI is still `/api/auth/callback/google`.
7. Update `apps/website/public/docs/authentication.md` if any snippet or version mention changed.

## Rollback

Revert the commit and redeploy. There is no schema change, so no data rollback is needed, unless step 5 produced SQL that was applied.

## Done when

`pnpm audit` shows no Better Auth advisory; typecheck, build and tests pass; Google login works on staging.
