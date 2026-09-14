# 02 - Shape requirements

Turn the resolved context into a compact, implementation-ready PRD model.

## Inputs

- `ProjectContext` (required) - output of `resolve-context`.
- `conversation` (required) - product requirements and decisions.

## Outputs

A structured PRD model containing problem, users/jobs, scope, flows, requirements, acceptance criteria, technical decisions, validation, success criteria, risks and open questions.

## Depends on

- `resolve-context`

## Process

1. Read `references/prd-contract.md`.
2. Extract product facts before inventing structure: problem, outcome, actors, jobs, constraints, explicit scope and explicit exclusions.
3. Write requirements as observable behavior. Pair each material requirement with an acceptance criterion.
4. Derive the smallest set of flows needed to explain the behavior, including failure/permission paths when relevant.
5. Add technical decisions only where they constrain delivery. Prefer existing project seams and ownership boundaries.
6. Gate data, API, UI, identity, async, observability, deployment and migration detail using the relevance rules in `references/prd-contract.md`.
7. Separate Existing, Requested, Proposed and Unknown decisions. Do not turn assumptions into facts.
8. Produce delivery slices only when they clarify dependencies or reduce implementation risk; do not add fake timeline estimates.
9. Finish when every in-scope behavior is covered by a requirement and acceptance criterion, and every proposed technical change supports an in-scope behavior.

## Test

```bash
node scripts/validate-portability.js shape-requirements
```
