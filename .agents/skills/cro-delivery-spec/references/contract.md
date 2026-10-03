# Conversion Implementation Contract

The contract is the seam between approved CRO strategy and implementation.

## Ownership

Upstream owns audience/ICP, traffic intent, offer, approved copy/proof, CRO hypothesis, success criteria, and measurement/CRM decisions. Delivery spec owns implementation requirements, affected surfaces, acceptance, risk, rollback, blockers, and evidence status.

Do not reconstruct missing upstream decisions from raw context.

## Status

Use exactly `READY`, `NEEDS_EVIDENCE`, `UNKNOWN`, or `BLOCKED`.

Apply status per affected surface. Safe surfaces may continue while unrelated surfaces remain blocked. A weak status never becomes `READY` by assumption.

## Change surfaces

Map only what the approved decision touches, for example page/layout, form, measurement, experiment assignment, backend/integration, external destination, or design system. Stay at requirement level, not code level.

## Acceptance and risk

Every material decision needs an observable acceptance criterion and evidence type. Preserve control/variant identity for experiments. Record `low`, `medium`, or `high` implementation risk. High-risk or sensitive measurement/integration changes require an explicit rollback or human gate.

When a technical conflict would change an approved business decision, return the conflict for review rather than silently editing the contract.
