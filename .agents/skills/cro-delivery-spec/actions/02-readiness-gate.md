# 02-readiness-gate

## Purpose

Verify every implementation-critical decision has an owner and status.

## Inputs

- decision inventory

## Process

1. Check strategy/copy/form/measurement/design/technical dependencies independently.
2. Inherit the weakest status.
3. Continue unblocked surfaces when safe.
4. Never fill unknowns by assumption.

## Outputs

- READY/NEEDS_EVIDENCE/UNKNOWN/BLOCKED by surface

## Test

Missing conversion-event ownership must remain unresolved instead of being invented.
