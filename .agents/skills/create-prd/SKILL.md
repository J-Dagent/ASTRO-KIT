---
name: create-prd
description: Creates a project PRD from the current conversation and repository evidence, aligning technical decisions with an explicitly provided or detected stack. Use when the user asks to create, generate, draft, or write a PRD/product requirements document for a product or feature. Do NOT use for implementation plans, architecture-only documents, ADRs, or coding a feature without an explicit PRD request.
license: MIT
compatibility: agent-skills
metadata:
  version: "2.0.0"
---

# Create PRD

Produces a concise, implementation-ready Markdown PRD that reflects the project actually in front of the agent. Repository evidence supplies current-state facts; user instructions supply target-state intent.

## Available actions

| # | Action | Role | Input |
| --- | --- | --- | --- |
| 01 | `resolve-context` | Resolve product context, project boundaries and stack from evidence | conversation + repo |
| 02 | `shape-requirements` | Convert context into scoped, testable requirements | ProjectContext |
| 03 | `write-prd` | Render and write the PRD | PRD model + output path |
| 04 | `validate-prd` | Check completeness, provenance and stack coherence | generated PRD |

## Default flow

`01 -> 02 -> 03 -> 04`. No skipping.

## Transversal rules

- No default stack. Missing technical context stays unknown until evidence or the user supplies it.
- Treat the environment as a source of truth: inspect the repo instead of caching its technologies in this skill.
- Keep current state separate from requested target-state changes.
- Use project vocabulary, durable architecture decisions and ownership boundaries when present.
- Synthesize before interviewing. If a PRD is explicitly requested and the subject is identifiable, record non-blocking gaps as open questions. Ask only when the artifact or core subject is genuinely ambiguous.
- Keep implementation detail proportional. Prefer behavior, contracts and stable seams over code snippets or brittle file paths.
- Write to the user-provided path; default to `docs/PRD.md` when none is given.
- Final validation is mandatory and parent-owned.

### Harness portability

- Core behavior lives only in `SKILL.md`, `actions/`, `references/`, `assets/`, `scripts/` and `evals/`.
- Do not depend on provider-specific model names, commands or metadata.
- Optional harness adapters may be added under `agents/` without changing core behavior.

## References

- `references/context-resolution.md` - evidence order, ProjectContext contract and repo exploration rules.
- `references/prd-contract.md` - PRD content, adaptive technical sections, provenance and quality bar.

## Assets

- `assets/prd-template.md` - compact Markdown skeleton; conditional sections are omitted when irrelevant.
