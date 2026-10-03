# Delivery

Delivery is optional and repository-owned. It may be a direct integration, automation platform, queue, workflow, CRM service, backend function, or nothing.

## Contract

Use `assets/delivery-payload.template.json` when a canonical downstream payload is useful. The payload carries lead identity, normalized contact, dynamic form data, attribution, consent, and allowed technical context.

The browser must never receive private delivery credentials or capability URLs.

## Success semantics

Default unless the repository already defines otherwise:
1. backend acceptance/persistence succeeds;
2. the submission is considered accepted;
3. delivery is attempted or scheduled;
4. delivery failure is recorded/retried without erasing the accepted lead;
5. browser conversion/thank-you behavior follows the accepted success condition.

A downstream HTTP success is evidence only for that hop. Do not claim final CRM/ad-platform delivery without destination evidence.

## Conversion tracking

Emit browser conversion once, after the approved backend success condition. Use the same `event_id` where the analytics contract supports deduplication.

Do not fire conversion on client-side validation success, button click, or an unconfirmed network attempt.
