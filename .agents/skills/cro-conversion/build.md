# Build mode

Implement a contract inside the existing repository. Build the `READY` surfaces; report the others back untouched.

## Steps

1. **Read.** The contract, repository instructions and the code around each affected surface. Identify framework, rendering model, routing, component and styling conventions, design tokens, client and server boundaries, existing experiment and measurement wiring, and the repo's check commands.
2. **Map.** Tie each acceptance criterion to the smallest existing seam that satisfies it. Add an abstraction only when the repo already repeats the behaviour or the contract requires a reusable seam.
3. **Implement.** Approved structure, copy, proof, CTA, responsive behaviour and integrations, exactly as approved. Reuse existing tokens, components and styles, and keep accessibility at least at its current level. Local code structure is free; approved outcomes are fixed. Design choices shape layout and presentation; data, consent, attribution, experiment identity and measurement stay as contracted.
4. **Forms.** Hand form creation or data-path changes to `implement-forms` with `form_requirements` and the repository context, then place and style the resulting form here.
5. **Experiments.** Keep control, assignment, IDs and events; change only the approved variable. Rollback stays a simple switch or revert.
6. **Check.** Run the repo's typecheck, lint, tests and build as changes land, plus targeted runtime or browser checks on the affected pages.

## Handoff

Changed files mapped to acceptance criteria, checks run with results, surfaces not built and why, risks, and external verification still needed. Staging-ready is not deployed. Next mode: `validate`.
