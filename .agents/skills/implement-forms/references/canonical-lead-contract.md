# Canonical lead submission contract

Use one logical contract for Neon and Convex. Persistence adapters may differ; field semantics do not.

## Table / collection name

Default per-client project:
- PostgreSQL/Neon: `lead_submissions`;
- companion delivery table: `lead_deliveries`;
- Convex: equivalent collections such as `leadSubmissions` and `leadDeliveries`, following repo conventions.

Do not create `leads_<client_slug>` when each client already has an isolated repo/database. If a future shared multi-tenant database is explicitly selected, add a tenant/client key instead of dynamic table names.

## Canonical indexed projection

Keep these as first-class fields in this order:

1. `id` — database identifier;
2. `event_id` — unique correlation/idempotency key;
3. `schema_version` — canonical lead contract version;
4. `created_at` — trusted server/database timestamp;
5. `form_key`;
6. `form_version`;
7. `page_key`;
8. `page_version`;
9. `conversion_event`;
10. `full_name`;
11. `first_name`;
12. `last_name`;
13. `email`;
14. `phone`;
15. `consent_marketing`;
16. `consent_analytics`;
17. `channel`;
18. `utm_source`;
19. `utm_medium`;
20. `utm_campaign`;
21. `utm_content`;
22. `utm_term`;
23. `utm_id`;
24. `gclid`;
25. `gbraid`;
26. `wbraid`;
27. `fbclid`;
28. `fbc`;
29. `fbp`;
30. `ttclid`;
31. `ttp`;
32. `landing_page_url`;
33. `referrer`;
34. `posthog_distinct_id`;
35. `payload_json` / `payload` — rich JSON/object context.

Contact fields may be nullable only when the approved FormDefinition allows it.

## Never add client-specific columns automatically

Keep programme, campus, funding, project stage, message, quiz answers, quiz outputs, score, segment, persona, temperature, eligibility, intake date and similar fields under `payload_json.form`.

## payload_json

Use a stable envelope:
- `form` — dynamic fields and quiz;
- `attribution` — complete attribution snapshot, including values projected to columns;
- `consent` — detailed consent evidence;
- `technical` — `user_agent`, `ip_hash`, locale and other server/browser technical context;
- `experiments` — experiment/variant assignments.

The complete attribution subdocument is intentionally duplicated with selected columns: columns are the operational/indexed projection; `payload_json.attribution` is the versioned context snapshot.

Do not duplicate canonical contact fields throughout arbitrary nested JSON unless an explicit audit/migration requirement calls for raw input preservation.

## Delivery table

`lead_deliveries` should track transport state rather than pollute lead data:
- `id`;
- `lead_submission_id`;
- `destination`;
- `status` (`pending | sent | failed | skipped` or project equivalent);
- `attempt_count`;
- `last_attempt_at`;
- `delivered_at`;
- `http_status`;
- `error_code`;
- `error_message`.

A lead remains accepted when persistence succeeds even if n8n delivery fails, unless an approved contract changes that semantic.
