# Delivery and signals

## Delivery

Delivery is optional and repo-owned: a direct integration, automation platform, queue, workflow, CRM service, backend function, or none. Reuse the existing owner; a new delivery platform arrives only on request.

Use `assets/delivery-payload.json` when a canonical downstream payload is useful. Its `attribution`, `consent` and `technical` blocks are the submission's blocks, unchanged.

Default sequence, unless the repo defines another:

1. persistence succeeds and the submission is accepted;
2. delivery is attempted or scheduled;
3. a delivery failure is recorded and retried, and the accepted submission stays;
4. the browser success and thank-you behaviour follow acceptance.

An HTTP success proves that hop only. Final CRM or ad-platform receipt needs evidence from the destination.

## Browser conversion

Fire it once, after the approved server success condition, with the same `event_id` wherever the analytics contract deduplicates. Client-side validation, a button click or an unconfirmed request is not success.

## Server and offline conversions

The same submission feeds server-side events (Meta CAPI, TikTok Events API) and offline uploads (Google Ads offline and enhanced conversions, later CRM stages such as qualified or won), now or later:

- reuse `event_id` as the deduplication key with the browser event;
- send the click IDs and the server timestamp;
- the raw IP exists only during the intake request: a server event that needs it is sent from intake, and later uploads rely on click IDs and hashed contact;
- normalize email (trim, lowercase) and phone (E.164 with the form's or project's default country), then hash them with SHA-256 at send time inside the delivery owner; the submission keeps the normalized values;
- pass the stored ad consent signals, and send hashed user data only when that consent allows it;
- a later-stage upload references the original submission by id to recover its click IDs and consent.

## Configuration and secrets

Produce an environment delta with `assets/environment.json` before asking for any configuration change. Classify each value:

- **public**: intentionally safe in the browser;
- **private**: non-secret server or backend configuration;
- **secret**: credentials, connection strings, private webhook or capability URLs, salts, tokens, private keys, deployment keys.

Secrets live at the runtime that owns the operation, and the browser never receives database credentials, delivery credentials or capability URLs. PostgreSQL reuses the repo's connection variable and secret mechanism. Convex reuses the repo's public deployment URL convention and keeps deployment keys and integration secrets in the existing deployment or CI secret store.

Environment files, provider secret stores, CI secrets, deployment configuration and production data change only with explicit approval.
