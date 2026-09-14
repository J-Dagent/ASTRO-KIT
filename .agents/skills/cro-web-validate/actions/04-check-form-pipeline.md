# 04-check-form-pipeline

## Purpose

Invoke/compose `implement-forms` validation for any form in scope.

## Inputs

- form requirements
- runtime/server evidence

## Process

1. Invoke implement-forms validation.
2. Attach its result.
3. Test integration with the page.
4. Avoid duplicating its canonical contract.

## Outputs

- form validation report

## Test

This action must not re-document a second canonical attribution schema.
