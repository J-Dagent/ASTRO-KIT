# Environment and secret contract

Use this reference whenever a form is created, migrated, or moved between Neon/Drizzle and Convex.

## Core rule

Environment configuration belongs to the runtime boundary, not to `FormDefinition` and not to client-visible form code.

For every form change, produce an **Environment Delta** that states:
- which required variables already exist;
- which variables or secrets are missing;
- where each value must live;
- whether adding it changes runtime behavior or requires a deploy;
- whether the change is project-wide or form-specific.

Do not edit `.env`, `.dev.vars`, Wrangler secrets, Convex deployment variables, or CI secrets unless the user explicitly authorizes the write.

## Naming rules

Use uppercase `SNAKE_CASE` for runtime variables and secrets.

In a per-client repository/deployment, do **not** prefix environment names with a client slug. Keep the skill client-agnostic and derive only the form-specific portion from `form_key`.

Core names:
- `DATABASE_URL` - Neon/PostgreSQL connection string when the Neon variant uses this conventional name. Reuse an existing repository binding name instead of renaming production configuration merely for style.
- `IP_HASH_SALT` - required only when persisted IP hashing is enabled.

Canonical n8n webhook names:
- Guide -> `N8N_GUIDE_WEBHOOK_URL`
- Quiz -> `N8N_QUIZ_WEBHOOK_URL`
- Formation/Programme -> `N8N_FORMATION_<FORM_KEY>_WEBHOOK_URL`
- Other/custom form -> `N8N_<FORM_KEY>_WEBHOOK_URL`

Normalize `<FORM_KEY>` to uppercase `SNAKE_CASE`: trim, replace non-alphanumeric separators with `_`, collapse duplicate `_`, and uppercase.

Examples using generic placeholders only:
- `<form_key> = <programme_slug>` -> `N8N_FORMATION_<PROGRAMME_SLUG>_WEBHOOK_URL`
- `<form_key> = <custom_form_slug>` -> `N8N_<CUSTOM_FORM_SLUG>_WEBHOOK_URL`

`form_key`, `form_version`, `page_key`, `page_version`, and `conversion_event` still belong in versioned `FormDefinition`; the webhook secret name is only a deterministic runtime routing convention.

Never expose the webhook URL to the browser. Resolve the environment variable name server-side from the approved form pattern/key.

If an existing repository uses an approved historical binding name, preserve it through an explicit compatibility mapping until an approved migration changes it.

For a truly shared multi-client runtime, use a structured tenant secret/configuration store keyed by `<client_slug>`; do not hard-code real client names into this skill.

## Exposure classes

### Public runtime configuration

Safe to expose to browser code only when the value is inherently public and the repository already has an approved public-runtime mechanism.

Typical examples:
- GTM container ID;
- GA measurement ID;
- PostHog public project key and public host;
- public Convex deployment URL required by the browser client.

Never make a value public merely because a frontend library needs configuration. Verify the provider's exposure model and existing repository convention.

### Private server configuration

Non-secret identifiers that should normally stay server/config-side because the browser does not need them.

Examples when direct server-side media delivery is approved:
- Meta pixel/dataset identifier;
- TikTok pixel code;
- Google Ads customer or conversion-action identifiers;
- Airtable base/table identifiers.

Prefer storing these in n8n workflow configuration when n8n owns delivery.

### Secrets

Values that must never enter the browser bundle, git history, fixture snapshots, logs, or form payloads.

Core examples:
- Neon/PostgreSQL connection string;
- form-specific n8n webhook URL because the URL grants write capability;
- `IP_HASH_SALT`;
- API access tokens, OAuth client secrets, refresh tokens and private keys;
- Airtable personal access token if the application sends directly;
- Convex deploy keys used by CI.

## Cloudflare Worker / Astro intake boundary

When Astro runs on Cloudflare and owns the trusted form intake:

### Required concepts for Neon

| Concept | Recommended name | Exposure | Required when |
|---|---|---|---|
| PostgreSQL connection | `DATABASE_URL` or existing repo binding | secret | Neon/Drizzle persistence |
| form webhook | resolved `N8N_*_WEBHOOK_URL` name | secret | n8n delivery enabled for that form |
| IP hashing salt | `IP_HASH_SALT` | secret | `ip_hash` persistence enabled |

Declare required secret **names** in Wrangler configuration when the repository uses Wrangler's required-secrets feature. Store values with the platform secret mechanism, never in `vars`.

For deployed Workers, use the repository-approved Wrangler flow such as `wrangler secret put <NAME>` or versioned secret upload. Treat these as deployment-affecting writes and require explicit user approval before executing them. Typical names are:
- `wrangler secret put N8N_GUIDE_WEBHOOK_URL`
- `wrangler secret put N8N_QUIZ_WEBHOOK_URL`
- `wrangler secret put N8N_FORMATION_<FORM_KEY>_WEBHOOK_URL`
- `wrangler secret put N8N_<FORM_KEY>_WEBHOOK_URL`

These are command patterns only; never execute them unless the user authorizes the secret write. Typical names are:
- `wrangler secret put N8N_GUIDE_WEBHOOK_URL`
- `wrangler secret put N8N_QUIZ_WEBHOOK_URL`
- `wrangler secret put N8N_FORMATION_<FORM_KEY>_WEBHOOK_URL`
- `wrangler secret put N8N_<FORM_KEY>_WEBHOOK_URL`

These are command patterns only; never execute them unless the user authorizes the secret write.

For local development, follow the repository's existing uncommitted secret-file convention. Cloudflare supports `.dev.vars` or `.env`; do not introduce both into the same Worker configuration.

### Request-derived context

Derive `user_agent` and visitor IP from the trusted request/runtime boundary. Never accept browser hidden fields as authoritative for either value.

If `ip_hash` is enabled:
1. read the trusted visitor IP from the Cloudflare request context;
2. require `IP_HASH_SALT`;
3. hash server-side;
4. persist only the approved hash in `payload_json.technical.ip_hash`;
5. never use a fixed production fallback salt.

## Convex runtime

Do not introduce PostgreSQL, Drizzle, `DATABASE_URL`, SQL migrations, or SQL-shaped abstractions into the Convex variant.

### Browser/project configuration

Resolve the existing framework-specific public Convex URL variable from the repository. Do not invent a second public URL variable if the project already has one.

`CONVEX_DEPLOYMENT` is local/developer deployment selection, not a business secret. `CONVEX_DEPLOY_KEY` is a CI/deploy credential and must be treated as a secret; it is not a runtime form variable.

### Convex function environment variables

If a Convex function or HTTP action owns n8n/media delivery, store its required server secrets in the Convex deployment environment. Prefer declaring expected environment variables in `convex/convex.config.ts` for type-safe access and deployment-time validation when the repository supports that current pattern.

Set values per deployment through the approved Convex environment mechanism. Development, staging and production may use different values under the same canonical variable name. When Convex owns n8n delivery, use the same form-specific webhook names with the Convex environment mechanism, for example `npx convex env set N8N_GUIDE_WEBHOOK_URL` or the resolved `N8N_FORMATION_<FORM_KEY>_WEBHOOK_URL`. Treat these as secret writes and require explicit approval. When Convex owns n8n delivery, use the same form-specific webhook names with the Convex environment mechanism, for example `npx convex env set N8N_GUIDE_WEBHOOK_URL` or the resolved `N8N_FORMATION_<FORM_KEY>_WEBHOOK_URL`. Treat these as secret writes and require explicit approval.

Examples when Convex owns these responsibilities:
- the resolved form-specific `N8N_*_WEBHOOK_URL`;
- `IP_HASH_SALT` if hashing occurs at the Convex trusted boundary;
- direct-delivery provider secrets only when n8n is not the delivery owner.

If Astro/Cloudflare remains the trusted intake and delivery boundary while Convex is persistence only, keep those secrets at Cloudflare instead of duplicating them in Convex.

## Media and downstream integrations

Default architecture: n8n owns destination credentials. In that mode, the application runtime should **not** require Google/Meta/TikTok/Airtable credentials; it requires only the form-specific n8n webhook secret selected for the active form.

If an approved architecture sends directly from the application/server, use provider-scoped names and classify each value explicitly.

Suggested canonical concepts:

### Meta direct server delivery
- `META_PIXEL_ID` - private server configuration;
- `META_CAPI_ACCESS_TOKEN` - secret.

### Google Ads direct server delivery
- `GOOGLE_ADS_CUSTOMER_ID` - private server configuration;
- `GOOGLE_ADS_CONVERSION_ACTION_ID` - private server configuration;
- `GOOGLE_ADS_DEVELOPER_TOKEN` - secret;
- `GOOGLE_ADS_CLIENT_ID` - server-only credential/config;
- `GOOGLE_ADS_CLIENT_SECRET` - secret;
- `GOOGLE_ADS_REFRESH_TOKEN` - secret.

Use only the subset required by the approved Google delivery method. Do not invent credentials for an integration that is not implemented.

### TikTok direct server delivery
- `TIKTOK_PIXEL_CODE` - private server configuration;
- `TIKTOK_EVENTS_ACCESS_TOKEN` - secret.

### Airtable direct server delivery
- `AIRTABLE_BASE_ID` - private server configuration;
- `AIRTABLE_TABLE_ID` - private server configuration;
- `AIRTABLE_ACCESS_TOKEN` - secret.

When n8n owns any of these destinations, keep their credentials in n8n's credential store or equivalent secret mechanism rather than duplicating them in the app runtime.

## Form-specific configuration is not environment configuration

Keep these in the versioned form/page contract, not environment variables:
- `<form_key>` and `<form_version>`;
- `<page_key>` and `<page_version>`;
- `<conversion_event>`;
- visible/dynamic field definitions;
- quiz question/output definitions;
- thank-you route;
- attribution profile switches;
- consent requirements;
- experiment IDs/variants unless an existing feature-flag system owns them.

## Required output: Environment Delta

For every new full-stack form, report at minimum:

```text
Backend: neon | convex
Trusted intake: cloudflare_astro | convex_http_action | existing_server_boundary
Delivery owner: n8n | direct_server | mixed

Required existing configuration:
- <name> | public/private/secret | location | present/missing | reason

New configuration required:
- <name> | public/private/secret | location | reason | write_requires_approval

Webhook configuration:
- State the exact form-specific n8n webhook secret name and whether it already exists or must be added.
```

Every production form using n8n delivery must resolve one server-side webhook secret. Guide and Quiz use fixed canonical names; Formation/Programme and custom forms derive the name from `<form_key>`.
