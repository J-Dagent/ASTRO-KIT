# 08-prepare-runtime-environment

## Purpose

Resolve and document the runtime variables, public configuration and secrets required for the form pipeline without leaking values, using the canonical form-specific n8n webhook naming convention.

## Inputs

- backend mode
- trusted intake boundary
- persistence implementation
- delivery architecture
- repository environment conventions

## Process

1. Read `references/environment-contract.md` and the active backend adapter.
2. Inventory existing public variables, private server configuration, Cloudflare/Convex secrets, CI configuration and n8n ownership without printing secret values.
3. Resolve the n8n webhook secret name from the form pattern/key:
   - Guide -> `N8N_GUIDE_WEBHOOK_URL`;
   - Quiz -> `N8N_QUIZ_WEBHOOK_URL`;
   - Formation/Programme -> `N8N_FORMATION_<FORM_KEY>_WEBHOOK_URL`;
   - Other custom forms -> `N8N_<FORM_KEY>_WEBHOOK_URL`.
   Normalize `<FORM_KEY>` to uppercase `SNAKE_CASE`.
4. Decide where the database binding, the resolved n8n webhook secret, `IP_HASH_SALT`, public analytics identifiers and any approved direct-integration credentials belong.
5. For Convex, place secrets according to the actual trusted/server integration boundary rather than copying the Neon environment layout.
6. Produce an Environment Delta from `assets/environment-manifest.template.json`.
7. Do not execute secret writes, edit `.env` files, deploy, or mutate provider configuration without explicit approval.

## Outputs

- Environment Delta
- missing configuration list
- public/private/secret classification
- exact runtime location for each required concept
- resolved n8n webhook secret name and whether it is present or missing

## Test

A Guide form must resolve `N8N_GUIDE_WEBHOOK_URL`; a Quiz form must resolve `N8N_QUIZ_WEBHOOK_URL`; a Programme form with `<form_key>` equal to `msc-marketing` must resolve `N8N_FORMATION_MSC_MARKETING_WEBHOOK_URL`. A Neon deployment missing the database connection must report a missing server secret; a Convex persistence-only deployment must not request `DATABASE_URL`.
