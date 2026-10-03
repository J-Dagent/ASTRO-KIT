# Environment

Produce an Environment Delta before requesting configuration changes. Use `assets/environment-manifest.template.json`.

## Classify values

- **Public:** intentionally safe for browser exposure.
- **Private:** non-secret server/backend configuration.
- **Secret:** credentials, connection strings, private webhook/capability URLs, salts, tokens, private keys, deployment keys.

Keep secrets at the runtime that owns the operation. Never promote a secret to public configuration for convenience.

## PostgreSQL

Reuse the repository's existing connection variable/binding and secret mechanism. The browser never receives database credentials.

## Convex

Reuse the repository's existing public deployment URL convention. Keep deployment keys and integration secrets in the deployment/CI secret mechanisms already used by the project.

## Request metadata

Derive authoritative IP/user-agent only from a trusted runtime/backend context. If unavailable, record it as unavailable. Never substitute browser-provided hidden fields.

If IP hashing is required, use a secret salt at the trusted boundary and persist only the approved hash.

## Approval boundary

Do not edit environment files, provider secret stores, CI secrets, deployment configuration, or production data/migrations without explicit approval.
