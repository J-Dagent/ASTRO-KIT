# 02-plan-at-stable-seams

## Purpose

Choose the smallest stable implementation seams and tests before coding.

## Inputs

- repo context
- acceptance criteria

## Process

1. Choose as few durable seams as possible.
2. Define tests at those seams before implementation.
3. Prefer contract/runtime behavior over component internals.
4. Keep the plan small and reversible.

## Outputs

- implementation plan
- test seams

## Test

Prefer a route/component/form-contract seam over tests coupled to internal component structure.
