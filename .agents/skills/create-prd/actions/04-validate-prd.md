# 04 - Validate PRD

Check the generated PRD for product completeness, stack coherence and evidence hygiene before confirming delivery.

## Inputs

- `ProjectContext` (required) - source of technical truth and assumptions.
- `prd_model` (required) - structured requirements.
- `output_path` (required) - generated Markdown file.

## Outputs

A validated PRD plus a short confirmation containing the path, key scope summary and any assumptions/open questions.

## Depends on

- `write-prd`

## Process

1. Read the generated file and compare it with `ProjectContext` and `references/prd-contract.md`.
2. Fail validation if a technology appears as an existing/current fact without evidence, or if a previous default stack leaked into the document.
3. Verify every in-scope material requirement has observable acceptance coverage and explicit out-of-scope boundaries exist.
4. Verify conditional technical sections are justified by the feature rather than the capabilities of the detected stack.
5. Verify current-state facts and target-state changes are not conflated.
6. Verify there are no unresolved template tokens, fake timeline estimates, contradictory requirements or unsupported file/code details.
7. Fix the PRD in place until all checks pass.
8. Confirm the output path, summarize the PRD in 3-5 bullets, and list assumptions/open questions only when present.

## Test

```bash
node scripts/validate-portability.js validate-prd
```
