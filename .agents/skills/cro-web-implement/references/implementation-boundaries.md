# Implementation boundaries

Treat approved business outcomes as strict and local code structure as flexible.

Preserve approved copy, CTA semantics, proof, form requirements, success behavior, experiment/control identity, measurement IDs, and `must_preserve` / `must_not_change` constraints.

Full-stack form work belongs to `implement-forms`. Pass the contract's form requirements and repository context; do not create a second attribution helper, canonical submission schema, persistence schema, or delivery contract in this skill.

For experiments, keep the current control, assignment mechanism, and IDs. Change only the approved variable unless the contract explicitly defines a route or compound test.

If implementation evidence conflicts with an approved decision, stop only that surface and return `CHALLENGE → EVIDENCE → REVIEW`. Do not silently reinterpret strategy.

Handoff should map changed files and checks to acceptance criteria and list external verification still required. Staging readiness is not production deployment.
