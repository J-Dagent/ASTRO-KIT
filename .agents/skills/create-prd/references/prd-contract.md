# PRD contract

A useful PRD describes product behavior, scope and decisions without turning into a brittle implementation dump.

## Required content

Every PRD must make these things clear:

- Problem and intended outcome.
- Primary users or actors and their jobs-to-be-done.
- In-scope and out-of-scope behavior.
- Main user/system flows.
- Functional requirements with observable acceptance criteria.
- Technical context and implementation decisions when they are known or constrain delivery.
- Validation/testing approach at behavioral seams when implementation will need verification.
- Success criteria.
- Delivery slices or dependency order when they materially improve execution.
- Risks, assumptions and open questions.

## Adaptive technical sections

Include technical detail only when it constrains the feature. Gate it by relevance:

- UI/interaction: when there is a user-facing surface.
- Data/state: when persistent or shared state changes.
- APIs/contracts/integrations: when a seam or external system is involved.
- Identity/security/privacy: when auth, permissions or sensitive data are involved.
- Async/background work: when work crosses request boundaries or is delayed/retried.
- Observability/analytics: when success or failure needs instrumentation.
- Deployment/runtime: when the feature changes runtime or operational constraints.
- Migration/compatibility: when existing data, APIs or users must transition.

No gated section should exist merely because a reference stack supports it.

## Decision provenance

Technical statements must be one of:

- **Existing**: observed in the repository or durable project docs.
- **Requested**: explicitly required by the user/conversation.
- **Proposed**: a new recommendation necessary to make the PRD actionable.
- **Unknown**: intentionally unresolved.

Prefer Existing and Requested. Use Proposed sparingly and make the tradeoff visible. Never present a guess as Existing.

## Specificity

Prefer contracts and behavior over implementation trivia. Avoid exact file paths, full schemas and code snippets unless the user explicitly asks for them or the detail itself is the decision.

Use existing project seams and ownership boundaries before inventing new ones. When a change crosses boundaries, state which responsibility belongs on each side.

For validation, reuse executable seams and test conventions already present in the project. Do not invent a test runner, CI system or deployment workflow just to make the PRD look complete.

## Quality bar

The PRD is done when an implementation agent can tell what to build, what not to build, how behavior is accepted, and which technical constraints are facts versus proposals without having to reverse-engineer the author's assumptions.
