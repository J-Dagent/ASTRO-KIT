# 08-route-handoff

## Purpose

Route the next work to the correct owner/skill without implementing it.

## Inputs

- audit
- experiments

## Process

1. State the diagnosis and decision.
2. Choose the minimum downstream skill/owner.
3. Provide only the context needed by that owner.
4. State blockers and evidence status.

## Outputs

- next owner/skill
- handoff payload
- blockers

## Test

A build-ready page change routes to cro-delivery-spec; a post-lead activation problem routes to the activation owner rather than frontend implementation.
