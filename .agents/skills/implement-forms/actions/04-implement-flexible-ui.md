# 04-implement-flexible-ui

## Purpose

Implement or reuse Astro components and React islands for the selected pattern while respecting design context and existing conventions.

## Inputs

- FormDefinition
- repo
- optional DESIGN.md

## Process

1. Use existing Astro composition, React islands, and shadcn conventions.
2. Keep hero integration when required by the approved page.
3. Implement field/error/loading/success states.
4. For Quiz, support arbitrary question IDs and a final contact step.
5. Respect optional DESIGN.md.

## Outputs

- UI code
- client validation
- accessible states

## Test

A valid implementation may refactor legacy components; it must not be rejected solely for not reproducing GuideLeadFormCard or FormationLandingPage<TInput> names.
