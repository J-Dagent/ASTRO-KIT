# 03-audit-message-match

## Purpose

Audit promise and expectation continuity across acquisition, page, form and next step.

## Inputs

- traffic context
- ad/query promise
- LP/form/follow-up evidence

## Process

1. Extract promise, mechanism, proof, CTA and next-step expectation at each available stage.
2. Compare stages.
3. Label mismatch NONE/MINOR/MAJOR/CRITICAL.
4. Route the owner of the mismatch.
5. Use `references/coo-cro-principles.md` and `references/traffic-context-routing.md` to interpret commitment and channel intent.

## Outputs

- message-match severity
- specific mismatches
- owner

## Test

A page whose form asks for a materially different commitment than the ad promise must be flagged MAJOR or CRITICAL.
