---
name: implement-forms
description: Implement, migrate, or modify any production form inside an existing repository. Use whenever a form is created or changed, including generic contact forms, guide, quiz, programme, or other capture flows that need attribution, consent, persistence, delivery, or conversion tracking. Inspect and reuse the repo's frontend, trusted server boundary, backend, persistence layer, and delivery path. Supports PostgreSQL through the existing data layer and Convex through native functions. Enforce FormDefinition, CanonicalLeadSubmission, idempotency, trusted request metadata, and secret boundaries.
---

# Implement forms

Build or modify the form inside the repository's existing architecture. Do not introduce a new stack unless the task requires it.

Prefer repository evidence over remembered framework conventions.
Use the bundled templates and validators as the source of truth for exact contract shape.
If a product requirement cannot be inferred, ask only for that missing requirement.

## Process

1. **Inspect.** Read repo instructions, manifests, framework/runtime config, existing forms, server/backend code, persistence, tracking, and deployment config. Finish when frontend, trusted intake, persistence, delivery, and environment ownership are identified or explicitly absent.
2. **Define.** Reuse an existing form contract or start from `assets/form-definition.template.json`. Default contact identity is `first_name` + `last_name` + `email`; `full_name` remains a configurable alternative. Keep form/page identity and versions explicit. Finish when contact fields, dynamic fields, consent, attribution, conversion event, and success behavior are known.
3. **Implement UI.** Reuse the repo's components, validation conventions, accessibility patterns, route conventions, and design system. Paths and placement are configurable. Hero is only a suggestion when no placement is specified; never create a Hero just to host the form. Finish when the intended interaction works without unnecessary design changes.
4. **Implement intake.** Revalidate at the trusted server boundary, normalize contact data, derive request metadata only from trusted context, create `event_id`, and build `CanonicalLeadSubmission`. Finish when browser-controlled metadata cannot overwrite server-derived facts.
5. **Persist.** Use the detected backend. PostgreSQL must reuse the existing ORM/query/migration path. Convex must use native schema, validators, functions, and indexes. Finish when retries with the same `event_id` cannot create duplicate accepted submissions.
6. **Deliver.** Reuse the approved delivery owner if one exists. Keep acceptance/persistence failure separate from downstream delivery failure unless the repo already defines another contract. Fire browser conversion only after the approved success condition. Finish when duplicate `event_id` cannot duplicate downstream effects.
7. **Validate.** Run the contract validators, the skill structure validator, relevant repo tests/typecheck, and review `evals/scenarios.json`. Finish only when checks pass or remaining blockers are explicit.

## Invariants

- `FormDefinition` is versioned configuration, not a database schema.
- `CanonicalLeadSubmission` is the stable submission contract across backends and delivery adapters.
- Attribution and consent are captured explicitly and revalidated at submit where applicable.
- Request-derived facts such as authoritative IP or user agent come only from a trusted server boundary.
- `event_id` is the idempotency key across persistence and downstream delivery.
- Client-specific fields and quiz outputs stay dynamic unless the domain model proves they are canonical.
- Form pattern never determines route or placement; both remain configurable.
- Secrets never enter browser bundles, payload templates, logs, or committed files.
- Do not edit secret stores, deploy, or run production migrations without explicit approval.

## Read when needed

- Data shape and form semantics: `references/contracts.md`
- Framework/runtime integration and trusted boundary: `references/repository-integration.md`
- PostgreSQL or Convex persistence: `references/persistence.md`
- Delivery and conversion semantics: `references/delivery.md`
- Runtime configuration and secrets: `references/environment.md`
