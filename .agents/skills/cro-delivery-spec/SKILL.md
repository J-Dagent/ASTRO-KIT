---
name: cro-delivery-spec
description: Convert an approved CRO decision, copy, measurement requirements, and repository context into a deterministic Conversion Implementation Contract before coding. Use when strategy is already owned and implementation needs exact surfaces, form requirements, acceptance criteria, evidence status, and rollback. Do not invent strategy, choose unowned measurement decisions, implement code, or deploy.
---

# CRO Delivery Spec

## Workflow

1. Read the approved audit, copy/spec, measurement decisions, and repository evidence. Reuse settled decisions instead of re-interviewing.
2. Assign `READY`, `NEEDS_EVIDENCE`, `UNKNOWN`, or `BLOCKED` per implementation-critical surface. The weakest unresolved dependency controls that surface.
3. Map approved changes to page, form, measurement, backend/integration, external-system, and design surfaces without prescribing code.
4. If a form is in scope, emit business/behavior requirements only and hand full-stack form implementation to `implement-forms`.
5. Capture existing design-system constraints only when they affect the approved experience. Missing optional design docs are not blockers.
6. Turn every approved decision into observable acceptance criteria. Add rollback and human gates where risk requires them.
7. Fill `assets/conversion-implementation-contract.template.json`, then run `node scripts/validate-contract.mjs <contract.json>`.

## Invariants

- Upstream owns audience, offer, approved copy/proof, CRO hypothesis, measurement taxonomy, and business success rules.
- This skill owns implementation requirements, affected surfaces, evidence status, acceptance criteria, and rollback.
- Never promote weak evidence to `READY` by assumption.
- Preserve stable decision, experiment, event, page, and form identities supplied upstream.
- A `READY` surface cannot contain blockers or implementation-critical unknowns.
- Keep forms persistence-agnostic here. `implement-forms` owns canonical submission and persistence behavior.
- Stop before code or deployment.

## References

- Read `references/contract.md` for ownership, statuses, surfaces, risk, acceptance, and rollback.
- Read `references/forms.md` only when a form is in scope.

## Output

Return one versioned Conversion Implementation Contract plus explicit blockers. Do not hide unresolved decisions in prose.

## Validation

Run the contract validator and `node scripts/validate-skill.mjs`. Evaluate the routing scenarios in `evals/scenarios.json` before handoff.
