# Context resolution

Resolve technical context from evidence. The repository is the source of current-state facts; user instructions define target-state intent.

## Context contract

Build a compact `ProjectContext` before writing requirements:

```json
{
  "project": "name or working title",
  "subject": "product or feature being specified",
  "output_path": "docs/PRD.md",
  "current_state": {
    "boundaries": [],
    "stack": [],
    "conventions": []
  },
  "target_state": {
    "changes": [],
    "constraints": []
  },
  "product_facts": [],
  "assumptions": [],
  "open_questions": []
}
```

Each `stack` entry is role-based rather than tied to a fixed taxonomy:

```json
{
  "role": "runtime | UI | service | data | auth | validation | deployment | testing | observability | other",
  "technology": "detected name",
  "evidence": "path, project instruction, or explicit user statement",
  "confidence": "explicit | detected | inferred"
}
```

Roles are extensible. Add only roles that exist in the project.

## Evidence order

Use this order when sources disagree:

1. Explicit user target-state instruction.
2. Explicit decisions already made in the current conversation.
3. Repository instructions and durable architecture decisions relevant to the area.
4. Workspace manifests, dependency manifests, runtime/deployment configs and generated metadata.
5. Source imports and nearby implementation patterns.
6. Unknown: leave it unresolved rather than inventing a technology.

Do not collapse current state and target state. A requested migration or replacement is a target-state change even when the repository still contains the old technology.

## Repository exploration

Use the lightest evidence that answers the question. Typical order:

1. Read repository instructions and top-level project docs.
2. Identify workspace/application/package boundaries.
3. Read manifests and configs for the relevant boundaries.
4. Inspect nearby source only when manifests or docs do not reveal the actual pattern.
5. Read domain glossary/ADRs when present and use their vocabulary and settled decisions.

Do not restate the whole repository. Capture only facts that constrain the PRD.

## Missing context

Do not interview by default. If the user explicitly asked for a PRD and the product/feature is identifiable, synthesize what is known and place non-blocking gaps in `Open Questions`.

Ask one clarification only when the requested artifact is ambiguous or there is no identifiable product, feature, user problem, or job-to-be-done to specify.
