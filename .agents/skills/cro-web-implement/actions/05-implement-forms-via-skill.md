# 05-implement-forms-via-skill

## Purpose

Delegate any full-stack form creation/change to `implement-forms` using the contract form requirements.

## Inputs

- form_requirements

## Process

1. Pass form_requirements and repo context to implement-forms.
2. Accept its canonical data/pipeline invariants.
3. Integrate the returned form surface into the page.
4. Do not duplicate form infrastructure.

## Outputs

- implemented form or explicit handoff

## Test

Do not create a second attribution helper or database schema inside this action.
