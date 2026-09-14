# 08-validate-contract

## Purpose

Validate structural completeness and inherited evidence status before handoff.

## Inputs

- contract

## Process

1. Validate required keys and status consistency.
2. Check form requirements when present.
3. Check acceptance/rollback.
4. Return issues before implementation handoff.

## Outputs

- valid/invalid
- issues

## Test

A contract with form_requirements but no form pattern or page/form identity must fail validation.
