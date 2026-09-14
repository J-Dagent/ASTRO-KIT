# Validation verdicts

Use one final verdict:
- `PASS_TO_STAGING` — executable checks pass and required evidence exists;
- `PASS_WITH_EXTERNAL_VERIFICATION` — code/runtime checks pass, but explicitly listed external platform proof is unavailable;
- `NEEDS_FIX` — implementation deviates from contract or executable checks fail;
- `NEEDS_EVIDENCE` — required contract/measurement/design evidence is missing;
- `BLOCKED` — cannot safely proceed.

Every failure includes:
- expected behavior;
- actual behavior;
- evidence;
- severity;
- owner/skill;
- fix or missing evidence;
- retest condition.
