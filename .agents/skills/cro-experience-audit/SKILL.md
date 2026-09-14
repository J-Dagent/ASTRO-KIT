---
name: cro-experience-audit
description: Audit client landing-page and funnel conversion experiences using the supplied COO CRO methods, traffic-intent routing, CRM-quality evidence, and the supplied CRO masterclass heuristics. Use for CRO diagnosis, message-match audits, form/friction analysis, paid-traffic LP reviews, and prioritizing the next 1–3 experiments. Do NOT use for implementing code, building media campaigns, inventing proof, or declaring business winners without downstream evidence.
---

# Cro Experience Audit

## Action router

| # | Action | Role |
|---|---|---|
| 01 | `ingest-evidence` | Normalize the evidence set without inventing missing business context. |
| 02 | `classify-traffic-and-page` | Classify traffic intent, page type, funnel stage and conversion action before judging tactics. |
| 03 | `audit-message-match` | Audit promise and expectation continuity across acquisition, page, form and next step. |
| 04 | `audit-conversion-architecture` | Audit page hierarchy, action accessibility, proof, objections, mobile and performance using context-sensitive heuristics. |
| 05 | `audit-form-and-friction` | Evaluate form placement, field justification, step count, quiz/booking friction and downstream quality impact. |
| 06 | `prioritize-opportunities` | Rank only the highest-leverage changes using business impact, confidence, evidence and effort. |
| 07 | `design-experiments` | Turn eligible opportunities into bounded experiments with measurement and decision rules. |
| 08 | `route-handoff` | Route the next work to the correct owner/skill without implementing it. |

## Default flow

Use the minimum actions required by the request. For a new end-to-end task, follow the table order unless repository evidence justifies skipping an action. Open only the references required for the active action.

## Transversal rules

- Treat CRM/business outcome as stronger evidence than raw LP conversion when available.
- Apply masterclass tactics as context-sensitive hypotheses, not universal laws.
- Preserve upstream strategy ownership; missing proof or decisions become NEEDS_EVIDENCE.
- Return diagnosis and experiments, never implementation code.

## References

- `references/method-provenance.md`
- `references/coo-cro-principles.md`
- `references/masterclass-cro-heuristics.md`
- `references/orchestration-boundaries.md`
- `references/traffic-context-routing.md`
- `references/audit-rubric.md`
- `references/experiment-principles.md`
- Default asset/template: `assets/cro-audit.template.md`

## Validation

Every action contains a concrete `## Test`. Before declaring completion, run the relevant executable checks and evaluate the scenarios in `evals/scenarios.json`.
