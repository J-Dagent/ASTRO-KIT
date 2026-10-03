# Validation verdicts

Use exactly one:
- `PASS_TO_STAGING`: required executable checks and evidence pass, with no unresolved external proof required for staging.
- `PASS_WITH_EXTERNAL_VERIFICATION`: code/runtime checks pass, but explicitly listed external platform proof still requires credentials or another environment.
- `NEEDS_FIX`: implementation deviates from contract or executable checks fail.
- `NEEDS_EVIDENCE`: required contract, measurement, design, or verification evidence is missing.
- `BLOCKED`: validation cannot proceed safely.

Every failure includes expected behavior, actual behavior, evidence, severity, owner, remediation or missing evidence, and exact retest condition.
