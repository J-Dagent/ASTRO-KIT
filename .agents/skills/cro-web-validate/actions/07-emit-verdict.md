# 07-emit-verdict

## Purpose

Emit one bounded verdict with evidence, owner and retest condition for every failure.

## Inputs

- all findings

## Process

1. Choose one allowed verdict.
2. List blockers/failures with evidence and owner.
3. List external verification gaps separately.
4. State exact retest condition.

## Outputs

- PASS_TO_STAGING/PASS_WITH_EXTERNAL_VERIFICATION/NEEDS_FIX/NEEDS_EVIDENCE/BLOCKED

## Test

Missing authenticated GTM proof may yield PASS_WITH_EXTERNAL_VERIFICATION, not a fake full pass.
