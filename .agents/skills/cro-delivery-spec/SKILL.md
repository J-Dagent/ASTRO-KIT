---
name: cro-delivery-spec
description: Turn an approved CRO decision, PRD/spec, copy, measurement requirements, and repository context into a deterministic Conversion Implementation Contract for Codex/Web Experience delivery. Use after CRO strategy is aligned and before coding, especially for LP changes, experiments, forms, tracking, or integrations. Do NOT use to invent strategy, choose unowned measurement decisions, implement code, or deploy.
---

# Cro Delivery Spec

## Action router

| # | Action | Role |
|---|---|---|
| 01 | `ingest-approved-decision` | Collect already-approved strategy, audit decisions, copy, evidence and project context. |
| 02 | `readiness-gate` | Verify every implementation-critical decision has an owner and status. |
| 03 | `map-change-surfaces` | Map the approved change to web, form, tracking, integration, backend and external-system surfaces. |
| 04 | `define-form-requirements` | When a form is in scope, produce only the business/behavioral requirements that `implement-forms` needs. |
| 05 | `resolve-design-context` | Record optional DESIGN.md or existing design-system constraints without coupling data behavior to design tooling. |
| 06 | `define-acceptance-and-rollback` | Turn decisions into observable acceptance criteria and rollback conditions. |
| 07 | `emit-contract` | Emit the versioned Conversion Implementation Contract using the bundled template. |
| 08 | `validate-contract` | Validate structural completeness and inherited evidence status before handoff. |

## Default flow

Use the minimum actions required by the request. For a new end-to-end task, follow the table order unless repository evidence justifies skipping an action. Open only the references required for the active action.

## Transversal rules

- Synthesize what is already decided; do not restart the interview.
- Inherit READY/NEEDS_EVIDENCE/UNKNOWN/BLOCKED status and never fill weak evidence by assumption.
- Keep strategy and Measurement ownership upstream; this skill specifies implementation, acceptance and rollback.
- When forms are involved, emit Form Requirements and route full-stack form behavior to implement-forms.

## References

- `references/contract-boundary.md`
- `references/form-handoff.md`
- Default asset/template: `assets/conversion-implementation-contract.template.json`

## Validation

Every action contains a concrete `## Test`. Before declaring completion, run the relevant executable checks and evaluate the scenarios in `evals/scenarios.json`.
