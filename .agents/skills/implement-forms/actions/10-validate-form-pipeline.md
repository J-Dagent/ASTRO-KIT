# 10-validate-form-pipeline

## Purpose

Run deterministic contract checks plus E2E cases for fields, attribution, consent, idempotency, environment readiness, backend and delivery semantics.

## Inputs

- implementation
- FormDefinition
- Environment Delta

## Process

1. Run bundled contract validators.
2. Run client/server validation cases.
3. Test attribution aliases and session persistence.
4. Test consent refusal.
5. Test event_id idempotency.
6. Verify required environment concepts exist without exposing secret values.
7. Test persistence and n8n sent/failed/skipped semantics.
8. Test browser event timing and success redirect.
9. Verify the active backend remains idiomatic: Drizzle/PostgreSQL for Neon, Convex schema/functions/indexes for Convex.

## Outputs

- validation report

## Test

Test at least one attributed and one unattributed submission, consent refusal, repeated event_id, backend failure, missing required environment configuration, and n8n failure/skipped behavior.
