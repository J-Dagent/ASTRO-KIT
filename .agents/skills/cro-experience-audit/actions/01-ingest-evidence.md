# 01-ingest-evidence

## Purpose

Normalize the evidence set without inventing missing business context.

## Inputs

- Current URL/screenshots/copy
- traffic source/query/ad context
- analytics/funnel data
- CRM quality
- upstream Acadelead outputs

## Process

1. Inventory supplied artifacts and their freshness.
2. Separate observed facts, source-derived heuristics and inference.
3. Mark each missing decision with its blocked downstream conclusion.
4. Preserve upstream owner decisions.
5. Read `references/method-provenance.md` and `references/orchestration-boundaries.md` when source ownership or evidence precedence matters.

## Outputs

- evidence inventory
- knowledge status
- missing evidence and blocked decisions

## Test

Given only CPL and no funnel/CRM evidence, mark downstream-quality conclusions NEEDS_EVIDENCE rather than blaming the page.
