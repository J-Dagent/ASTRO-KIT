# Plan: Polar SDK 0.34.17 → 0.49.0, then 1.x

Status: phase A done on `fix/polar-sdk-0.49` (2026-11-11), except the manual sandbox check (step 5); phase B needs a product decision. Prepared 2026-11-11 on top of `chore/deps-p3-minor`.

## Why

`@polar-sh/sdk@0.34.17` (in `apps/website`) depends on `zod@^3`, and resolves `zod@3.25.76`, which carries a high advisory (memory exhaustion, fixed in zod ≥ 4.6.6). The rest of the repo uses zod 4.6.7.

## Current usage

- `apps/website/src/server/polar.ts`: `new Polar({ accessToken, server })`.
- `apps/website/src/server/payments.ts`:
  - `products.list({ isArchived })` → `result.items`
  - `checkouts.create({ products, externalCustomerId, successUrl, customerIpAddress, customerEmail })`
  - `checkouts.get({ id })` → `status`, `productId`
  - `subscriptions.list({ externalCustomerId })` → `result.items[0]`
  - `customerSessions.create({ externalCustomerId })` → `customerPortalUrl`
- `apps/website/src/components/payments/polar/types.ts` derives UI types from these return types; `pricing-card.tsx` consumes them.
- Docs: `apps/website/public/docs/polar.md`.

## Phase A: 0.49.0, same API family (recommended now)

From 0.41.3, the SDK declares `zod: "^3.25.65 || ^4.0.0"`. 0.49.0 is the latest 0.x release. With it, pnpm resolves zod 4.6.7 and the zod 3 copy disappears.

A trial run on 2026-11-11 confirmed:

- the lockfile has a single `zod@4.6.7`;
- `pnpm audit` drops by one high;
- `pnpm build` and `pnpm test` pass;
- **`pnpm typecheck` fails with 3 errors** in `apps/website/src/components/payments/polar/pricing-card.tsx` (lines 32, 137 and 139).

Cause of the errors: in 0.49, `ProductPrice` (custom, fixed, metered unit, seat based) no longer has `type` or `recurringInterval`. Recurrence moved to the product: `product.isRecurring: boolean` and `product.recurringInterval: RecurringInterval | null`. Only `LegacyRecurringProductPrice` still carries `recurringInterval`.

Steps:

1. Set `"@polar-sh/sdk": "0.49.0"` in `apps/website/package.json`, then `pnpm install`.
2. In `pricing-card.tsx`:
   - Replace `price.type !== "recurring"` / `price?.type === "recurring"` with `product.isRecurring`.
   - Read the interval from `product.recurringInterval`.
   - Keep the `amountType` branches (`fixed`, `custom`). Add an explicit fallback for other amount types, such as `free`, `metered_unit` and `seat_based`, instead of assuming a currency.
3. Check the other consumers of `Product`, `Price` and `Subscription` in `apps/website/src/components/payments/polar/*` and `apps/website/src/actions/payments.ts` for fields that changed between 0.34 and 0.49. The typecheck will list them.
4. Run `pnpm typecheck`, `pnpm build`, `pnpm test` and `pnpm audit` (expect no zod advisory).
5. Manual sandbox check (`POLAR_SERVER=sandbox`): pricing page renders prices and intervals; checkout creation; success page validation; subscription lookup; customer portal link.

## Phase B: 1.x (later, separate branch)

1.0.2 is a rewrite (source: published package and the README in `polarsource/polar/sdk/typescript`). It has no zod dependency at all and requires Node ≥ 22.

| 0.x | 1.x |
|---|---|
| `import { Polar } from "@polar-sh/sdk"` | `import { createPolar } from "@polar-sh/sdk/2026-10"` (the API version is chosen by import subpath; the root entry exports only errors) |
| `new Polar({ accessToken, server })` | `createPolar({ accessToken, environment: "sandbox" \| "production" })` |
| `res.result.items` | `res.items` (plus `iterList` helpers) |
| camelCase request and response fields | snake_case: `external_customer_id`, `success_url`, `customer_ip_address`, `customer_email`, `is_archived`, `product_id`, `customer_portal_url` |
| `checkouts.get({ id })` | `checkouts.get(id)` |

Status values are unchanged (`succeeded`, `active`, …).

Impact: every call in `payments.ts`, the derived UI types (snake_case fields reach the React components through Astro Actions), `polar.md`, and a choice of API version (`2026-04`, `2026-10` or `2027-01`). Runtime on workerd is plausible (fetch-based, no `node:` imports found) but untested.

Do phase B only when there is a functional reason: a new Polar feature, the end of 0.x support, or webhooks via `webhooks.validateEvent`.

## Done when (phase A)

A single zod major in the lockfile; typecheck, build and tests pass; the sandbox payment flow works end to end.
