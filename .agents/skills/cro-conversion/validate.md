# Validate mode

Check what was built against what was approved. Validation compares expected with actual; strategy, design taste and the experiment winner stay out of scope.

Run this mode in a fresh-context subagent when one is available, passing the contract path, the diff or branch, and this file. The validator should not be the builder.

## Steps

1. **Scope.** Load the exact contract and the implementation. Check affected surfaces only, and carry unresolved statuses over unchanged.
2. **Fidelity.** Compare approved and actual: copy, CTA, proof, section order, form behaviour, success path, experiment and control identity, `must_preserve`, `must_not_change`.
3. **Runtime.** Run the repo's tests, build and preview. In a browser when possible: responsive layouts, keyboard and focus, validation and error states, success and next-step routes, contract-specific acquisition constraints.
4. **Forms.** When a form is in scope, run the `implement-forms` validator on its artifacts, then check `event_id` continuity, attribution, consent, trusted validation boundary, persistence outcome, delivery state and conversion timing.
5. **Measurement.** Check that the specified event names and IDs are emitted, stored and routed. Technical QA asks whether the implementation does this reliably; whether these were the right events is Measurement's question.
6. **Specialists.** Use the available accessibility, performance, code-review and browser tooling by capability, and merge their evidence.
7. **Verdict.** Emit one verdict. Done when every failure has expected, actual, evidence, severity, owner, remediation or missing evidence, and an exact retest condition.

A transport success (local handler, webhook, HTTP 200) proves that hop only. External destination receipt needs its own evidence; when credentials or environments are missing, list the gap instead of passing it.

## Verdicts

- `PASS_TO_STAGING`: executable checks pass; no failures, blockers or external gaps.
- `PASS_WITH_EXTERNAL_VERIFICATION`: code and runtime pass; the listed external proofs need credentials or another environment.
- `NEEDS_FIX`: deviation from the contract or a failing check.
- `NEEDS_EVIDENCE`: contract, measurement, design or verification evidence is missing.
- `BLOCKED`: validation cannot proceed safely.

## Report

For a machine-readable handoff, write this shape and check it with `node scripts/validate.mjs report <file>`:

~~~json
{
  "verdict": "NEEDS_EVIDENCE",
  "scope": [],
  "checks": [],
  "failures": [],
  "external_verification_gaps": [],
  "measurement_qa_note": null,
  "technical_qa_note": null,
  "blockers": []
}
~~~

Each `failures[]` item holds `expected`, `actual`, `evidence`, `severity`, `owner`, `retest_condition`.
