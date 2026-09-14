# Frontend autonomy

Treat the approved outcome as strict and the frontend implementation path as flexible.

Preserve:
- approved copy, CTA, proof, form requirements, tracking IDs and success behavior;
- existing project architecture and accessibility expectations;
- responsive behavior and design constraints.

Allow the implementing agent to choose:
- React component boundaries;
- composition patterns;
- Astro route/component organization;
- reuse vs extraction of existing components;
- refactors that clearly reduce duplication or improve maintainability without changing the approved contract.

Prefer existing seams. Add abstractions only when the repository demonstrates repeated behavior. Do not reproduce a legacy component tree mechanically when a simpler compatible implementation is available.

If a technical conflict requires changing an approved business decision, stop that decision surface and return `CHALLENGE → EVIDENCE → REVIEW`.
