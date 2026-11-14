---
name: cro-conversion
description: "CRO for landing pages and funnels, in four modes. audit: diagnose conversion and prioritize 1–3 experiments. spec: turn approved decisions into a Conversion Implementation Contract. build: implement a READY contract in the existing repo. validate: check an implementation against its contract before staging."
---

# CRO conversion

Four modes, one loop. Pick the mode from the request, read its file, and stop once that mode's output exists. Chain into the next mode only when the user asks for the chain; after `audit`, the next mode waits for the owner to approve the strategy.

| Mode | Input | Output | Read |
|---|---|---|---|
| audit | page or funnel + available evidence | CRO audit with 1–3 experiments | [audit.md](audit.md) |
| spec | approved decisions, copy, measurement, repo | Conversion Implementation Contract | [spec.md](spec.md) |
| build | READY contract + repo | changed code + handoff | [build.md](build.md) |
| validate | contract + implementation | one verdict report | [validate.md](validate.md) |

Paths to `assets/` and `scripts/` are relative to this skill's directory.

## Ownership

- **Strategy** owns audience, traffic intent, offer, promise, approved copy and proof, the CRO hypothesis and business success criteria.
- **Measurement** owns which events and signals matter and the decision rule.
- **Delivery** (spec, build, validate) owns surfaces, acceptance criteria, implementation, technical reliability and rollback.

Each decision stays with its owner. When a mode needs a decision it does not own, it marks the gap and names the owner. Offers, copy, proof, testimonials, logos, results, guarantees and measurement taxonomy come from their owners or stay marked missing.

## Evidence status

Every finding, surface and contract carries one status: `READY`, `NEEDS_EVIDENCE`, `UNKNOWN` or `BLOCKED`. The weakest unresolved dependency sets it; an assumption never upgrades it. Keep observed fact, owner decision, generic heuristic and inference visibly distinct, and current first-party evidence above generic heuristics.

## Business truth

Rank signals: revenue or sale → qualified opportunity → booked or attended step → lead → click or engagement. Decide on the strongest signal available and agreed. A passing build or QA never makes an experiment a winner; only the agreed decision rule does.

## Shared rules

- **Contract**: the seam between spec, build and validate. Template `assets/contract.template.json`, checked by `node scripts/validate.mjs contract <file>`.
- **Control**: an experiment keeps its control, assignment mechanism, IDs and events; only the approved variable changes. A variant becomes the control only when the decision rule is met.
- **Repository first**: work inside the existing framework, rendering model, design system and commands. A stack migration happens only when the contract requires it.
- **Forms**: creating a form or changing its data path (attribution, consent, intake, persistence, delivery, conversion) goes through the `implement-forms` skill. This skill supplies requirements and integrates the result.
- **Conflict**: when evidence contradicts an approved decision, stop that surface only and return the conflict with its evidence to the owner.
- **Approval**: secrets, production data, deployment and irreversible infrastructure change only with explicit approval.
