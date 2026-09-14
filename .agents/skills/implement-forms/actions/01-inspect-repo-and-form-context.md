# 01-inspect-repo-and-form-context

## Purpose

Inspect AGENTS.md, existing form/tracking/server/data seams, backend variant, environment boundary and any legacy contracts before deciding implementation.

## Inputs

- Form Requirements or user request
- repo

## Process

1. Read AGENTS.md.
2. Detect Neon/Drizzle vs Convex from actual code.
3. Detect the trusted intake boundary and current delivery owner.
4. Read `references/observed-form-architecture.md` when mapping legacy or existing form seams; never carry client-specific names or identifiers into the target contract.
5. Inspect existing form, tracking, consent, server and persistence modules.
6. Inspect environment variable **names and locations only**; never reveal secret values.
7. Identify legacy names/bindings, per-form webhooks and compatibility constraints.

## Outputs

- backend mode
- trusted intake boundary
- delivery owner
- existing reusable seams
- environment/config inventory by name and exposure class
- legacy compatibility risks
- missing evidence

## Test

A legacy repository with existing identifiers or per-form webhooks must be identified before renaming or deleting production contracts, and secret values must never appear in the inspection output.
