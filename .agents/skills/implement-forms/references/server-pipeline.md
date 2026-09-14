# Server pipeline invariants

## Required flow

`browser → Astro server boundary → validate/normalize/enrich → persistence → n8n delivery → browser success analytics/redirect`

The supplied handoff proves the current Neon implementation uses `createServerFn`, validates again on the server, persists before n8n, and fires `dataLayer`/PostHog after backend success. Preserve these semantics unless an approved architecture decision changes them.

## Browser responsibilities
- collect visible contact/business fields;
- capture/recapture attribution;
- capture current consent state;
- generate one `event_id` for the submission attempt and reuse it through every boundary;
- run UX validation for fast feedback;
- call the Astro Action;
- emit browser conversion only after the backend reports persistence success;
- redirect to the approved thank-you/success state.

## Trusted server responsibilities
- validate the payload again;
- normalize email and phone;
- normalize name according to `name_mode`;
- normalize attribution aliases and derive channel;
- set canonical timestamps;
- read request `user-agent` and store it under `payload_json.technical.user_agent`;
- obtain the client IP only from a trusted runtime request context;
- if IP hashing is enabled, require `IP_HASH_SALT`, calculate salted SHA-256, and store only `payload_json.technical.ip_hash` by default;
- build the canonical indexed projection + rich payload;
- persist idempotently;
- invoke n8n server-side only.

Never trust a browser-supplied IP. Never use a fixed fallback hash salt in production.

For Cloudflare Workers, the current trusted edge may expose the original visitor address through the request context/headers (commonly `CF-Connecting-IP`). Read it only on the server. If the runtime changes, use the equivalent trusted runtime mechanism.

Raw IP is transit-only by default. If an approved Measurement Contract requires raw IP for server-side media matching, pass it directly to the approved delivery adapter without persisting it unless explicit policy requires retention.

## Name normalization

If `name_mode=full_name`:
- preserve normalized `full_name` as authoritative input;
- derive `first_name`/`last_name` with a documented parser;
- do not pretend the heuristic is a verified legal split.

If `name_mode=first_last`:
- validate the provided components;
- derive `full_name`.

## Phone
Normalize to a canonical international representation (E.164 when applicable) at the server boundary. Preserve raw phone input only when explicitly required for audit/debugging.

## Idempotency
A repeated `event_id` must return the existing accepted submission rather than mutate its original business payload or reset delivery state. Delivery retries belong to the delivery layer.
