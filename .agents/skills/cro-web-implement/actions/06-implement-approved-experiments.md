# 06-implement-approved-experiments

## Purpose

Wire only approved experiment variants and measurement IDs.

## Inputs

- experiment contract

## Process

1. Preserve control and assignment.
2. Change only the approved variable/surface.
3. Preserve IDs/events.
4. Make rollback simple.

## Outputs

- variant code
- rollback/control preservation

## Test

Do not turn an experiment request into an uncontrolled full redesign.
