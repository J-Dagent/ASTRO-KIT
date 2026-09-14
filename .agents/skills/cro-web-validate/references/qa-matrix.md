# CRO web QA matrix

Validate at independent seams.

## Contract fidelity
- approved copy, CTA, proof and section architecture;
- form requirements and success behavior;
- must-preserve / must-not-change constraints;
- experiment/control identity.

## Runtime UX
- responsive behavior;
- focus, validation and error states;
- keyboard/accessibility basics;
- no unintended paid-traffic leaks when the contract calls for a focused paid LP;
- thank-you/next-step behavior.

## Form/data
Use `implement-forms` validation rather than re-implementing its data rules. Verify at minimum event_id continuity, attribution persistence, consent, server validation, persistence, n8n status handling and browser conversion timing.

## Measurement QA vs Technical QA
- Measurement QA: are the right events/conversions/signals specified? Owned upstream by Measurement Architecture.
- Technical QA: did the implementation emit/store/route them reliably? Owned here/CTO.

Do not turn technical success into a business/CRO winner verdict.
