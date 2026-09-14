---
name: cro-web-validate
description: Validate an implemented Acadelead CRO landing page against its approved Conversion Implementation Contract before staging, including contract fidelity, runtime UX, form pipeline, measurement implementation, performance/accessibility, and code quality. Use for CRO QA, PR validation, pre-staging checks, and external-verification gap reporting. Do NOT use to rewrite strategy, declare the business experiment winner, or infer media-platform receipt without evidence.
---

# Cro Web Validate

## Action router

| # | Action | Role |
|---|---|---|
| 01 | `load-expected-contract` | Load the approved contract and determine which evidence is required to validate it. |
| 02 | `check-contract-fidelity` | Compare actual implementation to approved copy, CTA, structure, proof, form, experiment and must-preserve constraints. |
| 03 | `check-runtime-experience` | Validate responsive behavior, navigation/CTA behavior, accessibility basics and success routes in a real browser when possible. |
| 04 | `check-form-pipeline` | Invoke/compose `implement-forms` validation for any form in scope. |
| 05 | `check-measurement-implementation` | Verify the specified events/IDs are technically emitted and routed, while keeping Measurement QA ownership separate. |
| 06 | `check-quality-specialists` | Use web-quality-audit, code-review and blast-radius when their domains are in scope. |
| 07 | `emit-verdict` | Emit one bounded verdict with evidence, owner and retest condition for every failure. |

## Default flow

Use the minimum actions required by the request. For a new end-to-end task, follow the table order unless repository evidence justifies skipping an action. Open only the references required for the active action.

## Transversal rules

- Compare expected contract to actual implementation; do not optimize by taste while validating.
- Compose with implement-forms for form/data QA and existing specialist skills for browser, web-quality and code review.
- Keep Measurement QA (right thing) separate from Technical QA (works reliably).
- Report external credential/platform gaps explicitly rather than fabricating a pass.

## References

- `references/qa-matrix.md`
- `references/verdicts.md`

## Validation

Every action contains a concrete `## Test`. Before declaring completion, run the relevant executable checks and evaluate the scenarios in `evals/scenarios.json`.
