# 01-load-expected-contract

## Purpose

Load the approved contract and determine which evidence is required to validate it.

## Inputs

- contract
- PR/build/runtime

## Process

1. Read the exact contract/IDs.
2. Build a validation checklist by surface.
3. Identify external checks requiring credentials.
4. Preserve evidence status.

## Outputs

- expected checklist
- blocked external checks

## Test

Do not validate from memory when the contract artifact exists.
