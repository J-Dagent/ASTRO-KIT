---
name: cro-experience-audit
description: Diagnose landing-page and funnel conversion experiences from traffic intent, message match, behavioral evidence, funnel data, and downstream business quality. Use for CRO audits, form/friction analysis, paid or organic landing-page reviews, and prioritizing the next 1–3 evidence-backed experiments. Do not implement code, build media campaigns, invent proof, or declare winners without the agreed evidence.
---

# CRO Experience Audit

## Workflow

1. Inventory current evidence and freshness. Separate observed facts, owner decisions, generic heuristics, and inference. Mark missing evidence instead of filling it.
2. Classify acquisition intent, page/funnel stage, conversion goal, and expected commitment before judging tactics.
3. Trace message continuity through acquisition promise → page → form/CTA → thank-you/follow-up → sales reality when evidence exists.
4. Audit conversion architecture, form/friction, proof, objections, mobile usability, and performance using context-sensitive heuristics.
5. Prioritize only the highest-leverage 1–3 opportunities using business impact, evidence confidence, reversibility, and effort.
6. When evidence supports testing, define bounded experiments with hypothesis, variable, metric, downstream signal, minimum data, decision rule, rollback, and owner.
7. Route implementation-ready changes to `cro-delivery-spec`; route activation, media, CRM, or measurement ownership elsewhere.

## Invariants

- Current first-party evidence and explicit owner decisions outrank generic heuristics.
- Prefer downstream business truth over weaker frontend proxies when available: revenue/sales → qualified opportunity → booked/attended step → lead → engagement.
- Treat channel names as context, not rules. Classify intent before applying page heuristics.
- Friction may be valuable when it improves qualification, trust, attribution, operations, compliance, or sales quality.
- Never invent testimonials, logos, results, guarantees, benchmarks, or unavailable proof.
- Behavioral evidence diagnoses; controlled experiments and agreed decision rules establish causal winners.
- Recommend at most 1–3 next experiments. Do not redesign everything because many medium issues exist.
- Return diagnosis and handoff, never implementation code.

## References

- `references/principles.md` for evidence precedence, traffic intent, useful friction, and ownership boundaries.
- `references/heuristics.md` for context-sensitive CRO mechanisms.
- `references/rubric.md` for finding structure and severity.
- `references/experiments.md` when proposing tests.

## Output

Use `assets/cro-audit.template.md` or an equivalent structure with explicit status, evidence, diagnosis, next experiments, owner, and blockers.

## Validation

Run `node scripts/validate-audit.mjs <audit.md>` when using the bundled template, then `node scripts/validate-skill.mjs`. Evaluate `evals/scenarios.json`.
