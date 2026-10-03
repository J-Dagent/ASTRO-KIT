# QA seams

## Contract fidelity

Compare approved copy, CTA, proof, section architecture, form requirements, success behavior, experiment/control identity, and `must_preserve` / `must_not_change` constraints.

## Runtime experience

Exercise responsive behavior, primary navigation/action flows, focus and keyboard behavior, validation/error states, success/next-step routes, and any contract-specific acquisition constraints. Prefer runtime evidence over static inspection when the experience can be run.

## Forms and data

Use `implement-forms` validators/artifacts when available. Otherwise verify the canonical artifacts supplied by implementation. At minimum check event/idempotency continuity, attribution, consent, trusted validation boundary, persistence outcome, configured delivery state, and conversion timing when those are in scope.

## Measurement

Measurement QA owns whether the right events/signals and business decision rule were specified. Technical QA owns whether the implementation emitted, stored, and routed the specified IDs/events reliably.

Do not treat a transport success response as proof of downstream platform receipt. Record unavailable external proof separately.
