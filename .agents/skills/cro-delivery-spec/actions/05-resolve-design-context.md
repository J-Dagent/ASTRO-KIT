# 05-resolve-design-context

## Purpose

Record optional DESIGN.md or existing design-system constraints without coupling data behavior to design tooling.

## Inputs

- repo/design inputs

## Process

1. Detect DESIGN.md and existing design-system evidence.
2. Record visual constraints only.
3. Keep Open Design optional.
4. Mark missing design input only when the change actually requires it.

## Outputs

- design context
- hard constraints
- missing evidence

## Test

Absence of DESIGN.md must not block implementation when the existing repo design system is sufficient.
