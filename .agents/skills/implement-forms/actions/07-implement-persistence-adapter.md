# 07-implement-persistence-adapter

## Purpose

Persist the same logical contract through Neon/Drizzle or Convex according to repository evidence.

## Inputs

- CanonicalLeadSubmission
- backend mode

## Process

1. Read the backend-specific reference.
2. Map canonical fields without changing semantics.
3. Store dynamic context in payload_json/nested objects.
4. Add real migrations/schema changes only through approved repo workflow.
5. Keep delivery state separate when implemented.

## Outputs

- lead_submissions record/document
- optional lead_deliveries

## Test

The Convex variant must not add Drizzle/Neon; the Neon variant must not create runtime DDL on every submission.
