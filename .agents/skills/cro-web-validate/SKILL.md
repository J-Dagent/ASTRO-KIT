---
name: cro-web-validate
description: Validate an implemented CRO web change against its approved Conversion Implementation Contract before staging. Use for contract fidelity, runtime UX, form-pipeline integration, technical measurement delivery, accessibility/performance checks, code quality, and external-verification gaps. Do not rewrite strategy, optimize by taste, declare the CRO experiment winner, or infer external platform receipt without evidence.
---

# CRO Web Validate

## Workflow

1. Load the exact approved contract and current implementation. Build checks only for affected surfaces and preserve unresolved evidence status.
2. Compare approved vs actual copy, CTA, proof, structure, form behavior, experiments, and `must_preserve` / `must_not_change` constraints.
3. Discover and run the repository's relevant test/build/preview path. Exercise real runtime behavior in a browser when possible, including responsive, keyboard, validation, error, and success paths.
4. When forms are in scope, compose with `implement-forms` validation when available. Otherwise validate against the canonical form artifacts supplied by implementation; do not invent a second schema.
5. Verify specified event names/IDs and technical emission/routing. Separate technical delivery from upstream Measurement QA and from external destination receipt.
6. Use available specialist tooling by capability for accessibility/performance, code review, browser/runtime, and risk analysis. Merge evidence without duplicating those domains.
7. Emit exactly one bounded verdict and attach owner, evidence, remediation or missing evidence, and retest condition for every failure.

## Invariants

- Validate expected contract against actual behavior. Do not improve the design while pretending to validate it.
- Technical QA asks whether implementation works reliably; Measurement QA asks whether the right thing was specified.
- A successful local handler, webhook, or HTTP response does not prove an external destination received or accepted the event.
- A build/runtime pass does not make a CRO experiment the business winner.
- External credential or platform gaps stay explicit; never fabricate a full pass.
- Use the repository's own architecture and commands. Do not require a particular framework, persistence provider, delivery tool, or browser tool.

## References

- `references/qa.md` for validation seams and evidence rules.
- `references/verdicts.md` for allowed final states.

## Output

When a machine-readable handoff is useful, copy `assets/validation-report.template.json` and validate it with `node scripts/validate-report.mjs <report.json>`.

## Validation

Run `node scripts/validate-skill.mjs`, repository-native checks, relevant runtime checks, and the scenarios in `evals/scenarios.json`.
