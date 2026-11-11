---
name: implement-forms
description: Create or modify any production form in an existing repo: contact, guide, quiz, programme or custom capture. Covers attribution capture, consent, trusted server intake, idempotent persistence (PostgreSQL or Convex), delivery and conversion signals for browser and offline paths.
---

# Implement forms

Build the form inside the repository's existing architecture: its frontend, trusted server boundary, backend, persistence and delivery. Repository evidence outranks remembered framework conventions. The JSON files in `assets/` define the exact contract shapes, and `scripts/validate.mjs` checks against them (paths relative to this skill's directory). When a product requirement (fields, success behaviour, destination) cannot be read from the request or the repo, ask for that requirement only.

## Steps

1. **Inspect.** Read repo instructions, manifests, runtime config, existing forms, backend entry points, persistence, tracking and deployment config. Done when the five owners are named or recorded `none`: UI, trusted intake, persistence, delivery, configuration and secrets. See [references/backend.md](references/backend.md).
2. **Define.** Reuse the existing form definition or start from `assets/form-definition.json`. Done when contact fields, business fields, consent, attribution, conversion event, path, placement and success behaviour are known. See [references/data.md](references/data.md).
3. **Build the UI.** Reuse the repo's components, form library, validation style, accessibility patterns and design system, at the requested path and section. Done when the interaction works with no unrequested design change.
4. **Intake.** At the trusted boundary: revalidate input, normalize contact data, derive request metadata, create `event_id`, and build the submission from `assets/submission.json`. Done when nothing browser-supplied can overwrite a server-derived fact.
5. **Persist.** Through the detected backend, in a store named after the project's conventions. Done when a retry with the same `event_id` cannot create a second accepted submission. See [references/backend.md](references/backend.md).
6. **Deliver and signal.** Reuse the existing delivery owner and fire the browser conversion after server acceptance. Done when a duplicate `event_id` cannot duplicate any downstream effect and the submission is offline-ready. See [references/delivery.md](references/delivery.md).
7. **Check.** Run `node scripts/validate.mjs <form|submission|delivery|env> <file>` on each artifact you produced, plus the repo's typecheck and relevant tests. Done when they pass or the remaining blockers are listed.

## Invariants

- **FormDefinition** is versioned configuration, not a database schema. Its pattern is descriptive; path and placement stay configurable.
- **Submission** (`CanonicalLeadSubmission`) is the one stable contract across backends and delivery adapters.
- **`event_id`** is the idempotency key from persistence through every delivery and conversion signal.
- **Trusted boundary**: IP, user agent and other request facts come only from server or backend context; otherwise they are recorded unavailable.
- **Attribution and consent** are captured explicitly and re-captured at submit.
- **Offline-ready**: every accepted submission keeps, retrievable by its id, what a later offline conversion upload needs: `event_id`, server timestamp, click IDs, consent state including ad signals, normalized contact, IP hash and user agent.
- **Dynamic data**: client-specific fields and quiz answers and outputs live in `payload_json`, not in new columns, unless the domain model proves them canonical.
- **Existing forms**: a modification keeps route, placement, contracts, tracking and delivery, and changes only what was asked.
- **Secrets** stay at the runtime that owns the operation: never in browser bundles, templates, logs or committed files.
- **Approval**: secret stores, environment files, deployments and production migrations change only with explicit approval.
