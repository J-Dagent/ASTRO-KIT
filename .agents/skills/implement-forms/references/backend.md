# Backend

## Owners

Identify five owners from the repo: UI and framework, trusted intake, persistence, delivery, configuration and secrets. Record an absent owner as `none` rather than inventing a subsystem, and record them all in `assets/environment.json`.

## Trusted boundary

Code that can revalidate input and observe server context: a framework handler, server route, backend service, serverless or edge function, Convex function or HTTP action. Use the smallest existing one that enforces the contract; one server hop is enough.

Direct client-to-backend submission is fine when that backend function is authoritative and no request fact it cannot observe is required. Otherwise route through an existing boundary that can observe it.

## Store name

The submission store (table or collection) takes its name from the project:

1. reuse the existing store that already holds form submissions;
2. otherwise derive the name from the domain glossary (`GLOSSARY.md`, or the legacy `CONTEXT.md`, ADRs, existing schema) and the repo's conventions for case, plural, prefix and schema;
3. when two names stay plausible, ask.

Record the choice in `assets/environment.json` under `persistence`. The word "Lead" in contract names is a contract name, not a store name.

## PostgreSQL

Reuse the existing client, ORM or query layer, migrations, transaction conventions and naming. Shape, when compatible with the existing model:

- searchable projections as columns;
- form, quiz and attribution detail in JSON or JSONB;
- a unique constraint (or equivalent) on `event_id`;
- delivery state stored separately when the repo tracks it;
- a transaction when acceptance spans several writes.

## Convex

Use native schema validators, indexes, mutations, actions, internal functions and HTTP actions. A mutation performs deterministic acceptance; actions handle external I/O; backend-only helpers stay `internal*`. Index the fields used for ownership, lookup, deduplication and operational queries, and guard `event_id` before inserting.

A Convex repo stays Convex-native: PostgreSQL, an ORM or a wrapper service arrive only on explicit request.

## Idempotency

One `event_id` is one submission attempt across retries. A replay returns the existing accepted submission and triggers no new downstream effect.
