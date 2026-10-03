---
name: cro-web-implement
description: Implement an approved Conversion Implementation Contract inside the existing web repository while preserving its framework, rendering model, design system, server boundaries, experiments, and project conventions. Use for approved CRO landing-page changes, variants, responsive sections, proof/CTA blocks, integrations, and form surfaces. Do not invent strategy, replace the stack without an explicit migration requirement, duplicate form infrastructure, or deploy sensitive changes without approval.
---

# CRO Web Implement

## Workflow

1. Read the approved contract, repository instructions, and affected code before editing. Stop any surface that is not implementation-ready.
2. Detect the existing framework, routing/rendering model, component/template conventions, design system, server boundaries, integrations, and repo-native checks.
3. Map acceptance criteria to the smallest stable and reversible implementation seams. Prefer existing patterns over new abstractions.
4. Implement approved structure, copy, proof, CTA, responsive behavior, and integrations without silently changing strategy.
5. Route full-stack form creation or canonical form-pipeline changes through `implement-forms`; integrate the resulting surface without duplicating its contracts.
6. For approved experiments, preserve the control, assignment mechanism, IDs/events, and the exact approved variable. Keep rollback simple.
7. Run the repository's relevant typecheck, lint, tests, build, and targeted runtime/browser checks as changes land.
8. Handoff changed files, acceptance coverage, checks run, risks, and external checks still required to review/validation.

## Invariants

- Repository architecture comes first. Do not introduce a new framework, state manager, design system, backend pattern, or delivery stack merely to match examples.
- The approved outcome is strict; component/template boundaries and local implementation details are flexible.
- Reuse existing tokens/components/styles. Optional design docs constrain visuals but never redefine form, attribution, consent, persistence, or measurement contracts.
- Preserve accessibility and responsive behavior unless the approved contract explicitly changes them.
- If a technical conflict requires changing an approved business decision, return `CHALLENGE → EVIDENCE → REVIEW` for that surface.
- Use available specialist tools by capability for browser/runtime, accessibility/performance, code review, and risk analysis. Do not depend on a specific tool name.
- Never alter secrets, production data, deployment state, or irreversible infrastructure unless explicitly authorized.

## References

- `references/repository-integration.md` for repository discovery and stack-preserving implementation.
- `references/implementation-boundaries.md` for strict vs flexible decisions, forms, experiments, and handoff.
- `references/design-context.md` when visual/design-system constraints are in scope.

## Validation

Use repository-native executable checks rather than duplicating framework QA here. Run `node scripts/validate-skill.mjs` and evaluate `evals/scenarios.json` before handoff.
