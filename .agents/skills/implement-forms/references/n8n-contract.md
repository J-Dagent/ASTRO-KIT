# n8n delivery contract

n8n is a server-side destination/router. The browser never calls a private n8n webhook directly.

## Canonical endpoint selection
Use a server-side webhook secret per form family/instance. The browser never receives or selects the webhook URL.

Canonical names:
- Guide: `N8N_GUIDE_WEBHOOK_URL`
- Quiz: `N8N_QUIZ_WEBHOOK_URL`
- Formation/Programme: `N8N_FORMATION_<FORM_KEY>_WEBHOOK_URL`
- Other/custom: `N8N_<FORM_KEY>_WEBHOOK_URL`

Normalize `<FORM_KEY>` to uppercase `SNAKE_CASE` before deriving the secret name. Example: `<form_key> = msc-marketing` -> `N8N_FORMATION_MSC_MARKETING_WEBHOOK_URL`.

Resolve the secret only at the trusted server boundary. Never place the URL in `FormDefinition`, hidden inputs, browser runtime variables, or the canonical lead payload. If a repository already uses another approved binding name, preserve it through an explicit compatibility mapping rather than silently breaking production.

## Canonical payload
Send one versioned object containing:
- `lead`: DB ID, event ID, submitted timestamp, form/page identity, conversion event;
- `contact`: full name, first name, last name, email, phone;
- `form`: dynamic fields and optional quiz answers/outputs;
- `attribution`: complete canonical attribution object;
- `consent`: detailed consent object;
- `technical`: allowed technical context, including user-agent and optional ip_hash;
- optional `delivery_context` required by the approved Measurement/CRM contract.

n8n should transform this canonical payload into Airtable/CRM/Google/Meta/TikTok destination shapes. It should not reconstruct form semantics from labels or URLs.

## Success semantics
By default:
- persistence success means the lead is accepted;
- n8n failure is recorded as delivery failure, not loss of the persisted lead;
- browser conversion/thank-you behavior follows persistence success, matching the current handoff unless the approved Measurement Contract changes the rule.

Do not claim Google/Meta/TikTok receipt merely because n8n returned 2xx. Destination delivery requires destination evidence.
