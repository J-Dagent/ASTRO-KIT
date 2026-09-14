---
name: cro-web-implement
description: Implement an approved Conversion Implementation Contract in Acadelead Astro Kit, preserving strategy while using repository-aware frontend engineering, optional DESIGN.md constraints, tests, and existing project skills. Use for building or modifying landing pages, approved CRO variants, responsive sections, proof/CTA blocks, and page integrations. Do NOT use to invent CRO strategy, duplicate the canonical form pipeline, or deploy sensitive changes without approval.
---

# Cro Web Implement

## Action router

| # | Action | Role |
|---|---|---|
| 01 | `inspect-contract-and-repo` | Read the implementation contract, AGENTS.md and affected code before editing. |
| 02 | `plan-at-stable-seams` | Choose the smallest stable implementation seams and tests before coding. |
| 03 | `resolve-design-context` | Apply DESIGN.md when present or existing design-system conventions when absent. |
| 04 | `implement-page-experience` | Implement approved page structure, copy, proof, CTA and responsive behavior with frontend autonomy. |
| 05 | `implement-forms-via-skill` | Delegate any full-stack form creation/change to `implement-forms` using the contract form requirements. |
| 06 | `implement-approved-experiments` | Wire only approved experiment variants and measurement IDs. |
| 07 | `run-implementation-checks` | Run relevant typecheck/build/tests and targeted browser checks as changes land. |
| 08 | `prepare-review-handoff` | Summarize changed files, acceptance coverage, risks and remaining external checks for review/staging. |

## Default flow

Use the minimum actions required by the request. For a new end-to-end task, follow the table order unless repository evidence justifies skipping an action. Open only the references required for the active action.

## Transversal rules

- The contract is strict; frontend/component implementation is flexible and context-aware.
- Prefer existing stable seams and improve legacy structure when evidence supports it.
- Any full-stack form work composes with implement-forms.
- Use DESIGN.md when present; never require Open Design.
- Run executable checks and hand off to review/validation; stop before production unless explicitly authorized.

## References

- `references/frontend-autonomy.md`
- `references/design-context.md`
- `references/astro-kit-integration.md`

## Validation

Every action contains a concrete `## Test`. Before declaring completion, run the relevant executable checks and evaluate the scenarios in `evals/scenarios.json`.
