# 01 - Resolve context

Build the evidence-backed product and technical context that the PRD will use.

## Inputs

- `conversation` (required) - current user request and prior decisions.
- `repo_root` (optional, default: current working directory) - project repository when available.
- `output_path` (optional, default: `docs/PRD.md`) - requested PRD path.

## Outputs

A `ProjectContext` matching `references/context-resolution.md`, with current state separated from target-state changes and every technical fact carrying evidence.

## Process

1. Read `references/context-resolution.md`.
2. Identify the product/feature subject, requested output path and explicit target-state constraints from the conversation.
3. If a repository is available, inspect project instructions and the minimum repo evidence needed to understand relevant boundaries, stack and conventions.
4. Record stack by role from evidence; do not fill absent roles.
5. Resolve conflicts using the evidence order. Keep current technologies and requested replacements distinct.
6. Record assumptions and open questions. Treat missing technology as unknown, never as permission to inject a preferred stack.
7. Finish only when every technical fact in `ProjectContext` is traceable to user/conversation/repository evidence or explicitly marked inferred/unknown.

## Test

```bash
node scripts/validate-portability.js resolve-context
```
