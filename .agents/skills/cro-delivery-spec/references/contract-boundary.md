# Contract boundary

The Conversion Implementation Contract is the seam between strategy and implementation.

Upstream owns:
- audience/ICP;
- traffic intent;
- offer and approved copy;
- proof claims;
- CRO hypothesis and success criteria;
- Measurement Contract / CRM Data Contract decisions.

This skill owns:
- converting approved decisions into deterministic implementation requirements;
- mapping affected technical surfaces;
- acceptance criteria, rollback, evidence, and blockers;
- producing Form Requirements for `implement-forms` when a form is involved.

This skill does not:
- invent missing marketing strategy;
- choose media conversions without a Measurement Contract;
- implement code;
- deploy.

Use statuses `READY`, `NEEDS_EVIDENCE`, `UNKNOWN`, `BLOCKED`. Do not hide unresolved fields inside prose.
