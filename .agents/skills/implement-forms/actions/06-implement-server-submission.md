# 06-implement-server-submission

## Purpose

Implement the trusted server intake: revalidation, normalization, request enrichment, idempotency mapping and canonical payload construction.

## Inputs

- client payload
- server pipeline

## Process

1. Revalidate with the server-owned schema.
2. Normalize contact/name/phone and attribution.
3. Derive server context (timestamp, user-agent, trusted IP hash).
4. Build one canonical payload.
5. Enforce event_id idempotency.

## Outputs

- CanonicalLeadSubmission

## Test

A client-supplied IP field must be ignored/rejected as authority; IP hash is derived server-side with required salt.
