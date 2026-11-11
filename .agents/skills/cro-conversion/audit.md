# Audit mode

Diagnose a landing page or funnel and choose the next 1–3 experiments. The output is a diagnosis and a handoff; implementation goes through `spec` once the owner approves. Media structure, budgets, CRM and measurement setup belong to their owners: name them in the handoff.

## Steps

1. **Evidence.** List what is available, with source and freshness: acquisition promise (ad, query, email, post), page, screenshots, recordings, heatmaps, funnel metrics, CRM or sales quality. Done when each item is tagged fact, owner decision, heuristic or inference, and each missing item is named.
2. **Intent.** Classify traffic intent (brand or high-intent, non-brand, mixed automated, cold prospecting, retargeting, organic, warm or direct), funnel stage, conversion goal and expected commitment. Channel names are context, not rules. Done before any tactic is judged.
3. **Message match.** Trace the promise through acquisition → page → form or CTA → thank-you and follow-up → sales reality, as far as evidence reaches. Done when every break is located and rated.
4. **Diagnosis.** Score the dimensions below on evidence, not aesthetics. Done when every material finding has observation, evidence, severity (`BLOCKER | HIGH | MEDIUM | LOW`), mechanism, recommended change, measurement requirement and owner.
5. **Prioritize.** Keep the 1–3 highest-leverage opportunities by business impact, evidence confidence, reversibility and effort. Order of leverage: route or offer mismatch → message match and above-fold clarity → CTA and form friction → proof → objections → polish. Root causes before presentation. Many medium issues still yield 1–3 experiments, not a redesign.
6. **Experiments.** Define each one as below when evidence supports a test; otherwise mark it `NEEDS_EVIDENCE` with the evidence to collect.

## Dimensions

Traffic and intent fit, message match, offer clarity, conversion-action fit, above-fold comprehension, form access and friction, proof quality and proximity to claims, objections and risk reversal, navigation and escape routes, mobile action access, loading speed, thank-you and follow-up path, tracking readiness, downstream quality.

Heuristics are candidate mechanisms, never requirements. Visitors scan: persuasion lives in headings, bullets, proof captions, CTA copy and objection answers. Intent-specific routes earn their place only when they give distinct value.

**Useful friction**: a field, step, eligibility gate or longer page can earn its place through qualification, trust, attribution, operations, compliance or sales quality. Weigh it before removing it.

Recordings, heatmaps and qualitative behaviour diagnose; controlled tests or stronger downstream evidence establish cause.

## Experiment

Falsifiable hypothesis; one primary variable (unless explicitly a route or compound test); primary KPI; downstream business signal when relevant; minimum data; decision rule or horizon; rollback; owner.

## Output

~~~markdown
# CRO_AUDIT

Status: READY | NEEDS_EVIDENCE | UNKNOWN | BLOCKED
Traffic context:
Page/funnel stage:
Conversion goal:
Evidence used:

## Diagnosis
| Priority | Issue | Evidence | Severity | Mechanism | Recommended change | Measurement | Owner |
|---|---|---|---|---|---|---|---|

## Message Match
Acquisition promise:
Page promise:
Form/CTA expectation:
Follow-up expectation:
Mismatch severity:

## Next Experiments
| # | Hypothesis | Variable | Primary KPI | Business signal | Minimum data | Decision rule | Rollback | Owner |
|---|---|---|---|---|---|---|---|---|

## Handoff
Next mode or owner:
Blockers:
~~~
