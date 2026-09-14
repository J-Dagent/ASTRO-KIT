# 03 - Write PRD

Render the PRD model to Markdown and write it to the requested project path.

## Inputs

- `ProjectContext` (required) - resolved project/product context.
- `prd_model` (required) - output of `shape-requirements`.
- `output_path` (optional, default: `docs/PRD.md`) - final Markdown path.

## Outputs

A Markdown PRD written to `output_path` with no unresolved template tokens.

## Depends on

- `shape-requirements`

## Process

1. Use `assets/prd-template.md` as the shape, not as boilerplate that must be filled verbatim.
2. Replace every template token. Omit empty conditional subsections rather than filling them with generic prose.
3. Keep the document product-first: behavior and acceptance before implementation detail.
4. In Technical context and decisions, summarize only stack/boundary facts relevant to the feature. Mark Requested or Proposed target-state changes explicitly when they differ from the current repo.
5. Prefer stable contracts and named project boundaries over exact file paths or code snippets.
6. Put assumptions and unresolved non-blocking choices in the final risks/open-questions section rather than interrupting the document with an interview.
7. Create parent directories if needed and write the Markdown file.
8. Finish only when the file exists at the requested path and contains no unresolved `{{...}}` token.

## Test

```bash
node scripts/validate-portability.js write-prd
```
