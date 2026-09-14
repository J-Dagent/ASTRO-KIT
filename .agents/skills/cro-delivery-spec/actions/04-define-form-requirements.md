# 04-define-form-requirements

## Purpose

When a form is in scope, produce only the business/behavioral requirements that `implement-forms` needs.

## Inputs

- approved form decisions
- CRM/Measurement contracts

## Process

1. Read the form-handoff reference.
2. Define pattern, identity, contact fields, dynamic fields, consent and success behavior.
3. Reference Measurement/CRM owners for event/destination decisions.
4. Preserve dynamic client fields.

## Outputs

- form_requirements object

## Test

Quiz question keys remain client-defined and the spec must not create SQL columns for them.
