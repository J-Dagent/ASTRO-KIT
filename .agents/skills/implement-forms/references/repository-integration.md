# Repository integration

Inspect before choosing an implementation.

## Evidence to read

Read the nearest repository instructions plus manifests, framework/runtime config, existing forms, backend/server entry points, persistence code, tracking code, and deployment config. Prefer existing conventions over examples in this skill.

Identify five owners:
1. UI/framework;
2. trusted intake boundary;
3. persistence;
4. delivery;
5. runtime configuration/secrets.

If an owner does not exist, record `none` rather than inventing a subsystem.

## Trusted boundary

A trusted boundary is code that can revalidate input and observe server/backend context. It may be a framework handler, server route, backend service, serverless/edge function, Convex function, or HTTP action.

Use the smallest existing boundary that can enforce the contract. Do not add a second server hop just to fit this skill.

Direct client-to-backend submission is acceptable when that backend function is already authoritative and no unavailable request-derived metadata is required. If the contract requires trusted request facts the backend cannot observe, route through an existing boundary that can.

## UI

Reuse the repository's component system, form library, validation style, accessibility patterns, and route conventions. Do not migrate frameworks or design systems to implement a form.

Keep view structure flexible. The invariants live in the contracts and trusted submission path, not component names.
