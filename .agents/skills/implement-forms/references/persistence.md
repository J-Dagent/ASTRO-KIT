# Persistence

Persist the same logical `CanonicalLeadSubmission` regardless of backend. Keep `event_id` unique or equivalently idempotent.

## PostgreSQL

Reuse the repository's existing PostgreSQL client, ORM/query layer, migrations, transaction conventions, and naming. Do not replace them to match an example.

Recommended shape when compatible with the existing model:
- canonical searchable projections as columns;
- dynamic form/quiz/attribution detail in JSON/JSONB;
- unique constraint or equivalent on `event_id`;
- delivery state stored separately when the repo tracks it.

Do not create a new column for every campaign, programme, quiz answer, or future client field.

Use a transaction when acceptance requires multiple writes to succeed atomically.

## Convex

Use native schema validators, indexes, queries/mutations/actions, internal functions, and HTTP actions as appropriate.

Prefer a mutation for deterministic database acceptance. Use actions only when external I/O is required. Keep backend-only helpers `internal*` when they are not part of the public client API.

Index fields used for ownership, lookup, deduplication, or operational queries. Enforce idempotency by looking up or otherwise guarding `event_id` before creating duplicate accepted submissions.

Do not add PostgreSQL, an ORM, or a wrapper service to a Convex-native repository unless explicitly requested.

## Idempotency

The same `event_id` represents the same submission attempt across retries. Replays must not create a second accepted lead or duplicate downstream side effects.
