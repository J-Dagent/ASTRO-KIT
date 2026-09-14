---
name: implement-forms
description: Implement and validate client-agnostic full-stack lead forms for Guide/lead-magnet, dynamic Quiz, and Formation/Programme landing pages in Astro, with flexible React UI but strict canonical collection, attribution, consent, server validation, Neon/Drizzle or Convex persistence, runtime environment/secrets planning, n8n delivery, and conversion tracking. Use when creating, adapting, migrating, or debugging a client lead form. Do NOT use to decide marketing strategy, invent measurement taxonomy, hard-code client quiz/business fields into the database, expose secrets, or send private webhooks directly from the browser.
---

# Implement Forms

## Action router

| # | Action | Role |
|---|---|---|
| 01 | `inspect-repo-and-form-context` | Inspect AGENTS.md, form/tracking/server/data seams, backend variant, runtime boundary and legacy contracts before deciding implementation. |
| 02 | `select-form-pattern` | Select Guide, Quiz, or Programme/Formation based on the approved path/behavior, without imposing visual structure. |
| 03 | `build-form-definition` | Create the versioned FormDefinition with contact mode, dynamic fields, quiz config, consent, attribution and success behavior. |
| 04 | `implement-flexible-ui` | Implement or reuse Astro components and React islands for the selected pattern while respecting design context and existing conventions. |
| 05 | `implement-attribution-and-consent` | Implement canonical session attribution, vendor/cookie capture and consent recapture at submit. |
| 06 | `implement-server-submission` | Implement the trusted server intake: revalidation, normalization, request enrichment, idempotency mapping and canonical payload construction. |
| 07 | `implement-persistence-adapter` | Persist the same logical contract through Neon/Drizzle or Convex according to repository evidence. |
| 08 | `prepare-runtime-environment` | Produce the public/private/secret Environment Delta for Cloudflare, Neon or Convex, n8n and any approved direct integrations. |
| 09 | `wire-n8n-and-browser-tracking` | Send the canonical server payload to n8n, record delivery state, and emit browser conversion only after persistence success. |
| 10 | `validate-form-pipeline` | Run deterministic contract checks plus E2E cases for fields, attribution, consent, environment readiness, idempotency, backend and delivery semantics. |

## Default flow

Use the minimum actions required by the request. For a new end-to-end task, follow the table order unless repository evidence justifies skipping an action. Open only the references required for the active action.

## Transversal rules

- Keep frontend/component structure flexible; keep backend/data/environment contracts strict.
- Use one canonical FormDefinition and CanonicalLeadSubmission across Neon and Convex.
- Keep form/page identity in versioned configuration, and derive the required n8n webhook secret name deterministically from the form pattern/key.
- Use form-specific n8n webhook secrets: `N8N_GUIDE_WEBHOOK_URL`, `N8N_QUIZ_WEBHOOK_URL`, `N8N_FORMATION_<FORM_KEY>_WEBHOOK_URL`, or `N8N_<FORM_KEY>_WEBHOOK_URL` for other form families.
- Never trust hidden inputs for attribution or client-supplied IP as authoritative.
- Persist first, then server-side n8n delivery; browser conversion fires only after persistence success unless an approved contract changes semantics.
- Keep client-specific business/quiz data dynamic in payload_json/form objects.
- For Neon, use PostgreSQL + Drizzle and real migrations; do not carry SQL patterns into Convex.
- For Convex, use validated documents/functions/indexes and Convex deployment environment practices; do not emulate relational SQL architecture.
- Keep Google/Meta/TikTok/Airtable credentials in n8n credentials by default when n8n owns delivery.
- Never print, commit, or expose secret values.
- Do not modify `.env` files, secret stores, deploy, or run DB migrations without explicit approval.

## References

- `references/form-patterns.md`
- `references/observed-form-architecture.md`
- `references/canonical-form-contract.md`
- `references/canonical-lead-contract.md`
- `references/attribution-contract.md`
- `references/server-pipeline.md`
- `references/neon-adapter.md`
- `references/convex-adapter.md`
- `references/n8n-contract.md`
- `references/design-boundary.md`
- `references/astro-kit-integration.md`
- `references/environment-contract.md`
- Default form asset: `assets/form-definition.template.json`
- Environment output asset: `assets/environment-manifest.template.json`

## Validation

Every action contains a concrete `## Test`. Before declaring completion, run the relevant executable checks and evaluate the scenarios in `evals/scenarios.json`.
