# CRO orchestration boundaries

Use this reference to preserve decision ownership.

## Strategy vs implementation

Upstream conversion strategy owns:
- audience / ICP / VOC;
- awareness and market context;
- value proposition, offer, promise and angle;
- approved persuasive structure and copy;
- proof selection;
- CRO hypotheses and success criteria.

Web/CRO delivery owns:
- implementation of the approved experience;
- frontend/runtime quality;
- forms and integrations;
- responsive, accessibility and performance;
- experiment variants and technical wiring;
- visual/functional/technical QA.

Do not reconstruct an upstream business decision from raw context. If an approved decision is missing, mark NEEDS_EVIDENCE or route back to the owner.

## Measurement vs technical reliability

Measurement architecture owns WHAT to measure and the business decision rule.
Technical delivery owns HOW the measurement runs reliably.

Keep distinct:
- Measurement QA: are we measuring the right thing?
- Technical QA: does the implementation work reliably?

## Status discipline

Use one of:
- READY
- NEEDS_EVIDENCE
- UNKNOWN
- BLOCKED

A weak status never becomes READY by assumption.
