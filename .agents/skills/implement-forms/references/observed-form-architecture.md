# Observed form architecture patterns

This reference preserves the reusable technical patterns extracted from the supplied production handoff without carrying any client-specific names, IDs, quiz values, URLs or business logic into the skill.

## Shared pipeline observed

`browser form → client validation → Astro Action → server validation/normalization → canonical record/snapshot → persistence → n8n → server response → browser conversion tracking → thank-you`

Reusable invariants:
- persistence happens before downstream webhook delivery;
- browser conversion is emitted only after the approved backend success condition;
- an n8n delivery failure must not silently erase a successfully persisted lead;
- one `event_id` correlates the same submission across browser, backend, persistence, automation and analytics;
- attribution and consent are recaptured at submit rather than trusting stale mount-time state;
- hidden DOM inputs are not the authority for attribution;
- request-derived technical data belongs to the trusted server boundary.

## Guide / lead-magnet pattern observed

Reusable behavior:
- form integrated in the hero;
- canonical contact fields plus optional dynamic qualification fields;
- acquisition/consent context captured automatically;
- submit to an Astro Action;
- thank-you/resource access after backend success.

Do not preserve any source-client field names or conversion IDs. Use `<form_key>`, `<page_key>`, `<conversion_event>` and client-defined dynamic field keys.

## Quiz pattern observed

Reusable behavior:
- one question/step at a time;
- local progress and back navigation;
- arbitrary answers keyed by question ID;
- optional client-defined derived outputs;
- final contact step;
- same canonical backend pipeline as other forms.

Target contract:
```json
{
  "answers": { "<question_id>": "<answer_value>" },
  "outputs": { "<output_key>": "<output_value>" }
}
```

Never create client-specific quiz columns in the canonical database.

## Formation / programme pattern observed

Reusable behavior:
- generic hero form rendered from configuration;
- contact fields plus optional message and client-defined business fields;
- one shared attribution/consent/server pipeline across programme pages;
- route/page-specific configuration should not create a new backend contract.

Treat any hidden business default as configuration-derived, not user-provided evidence.

## Repository seams to inspect

Do not require exact file names. Search the active repository for the equivalents of:
- Astro routes;
- reusable React form/hero components;
- form configuration;
- validation schemas;
- attribution capture;
- consent capture;
- analytics/browser conversion helpers;
- server submission functions;
- shared submission service;
- active persistence package (Neon/Drizzle or Convex);
- environment/binding configuration.

Reuse or improve the local architecture; preserve the canonical contracts and invariants rather than copying a legacy component tree.
