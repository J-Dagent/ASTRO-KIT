# Spec mode

Turn approved decisions into one versioned Conversion Implementation Contract. It states requirements; code comes in `build`.

## Steps

1. **Collect.** Read the approved audit, copy or spec, measurement decisions and the repository. Reuse settled decisions; ask only for what is missing, and only from its owner.
2. **Surfaces.** Map each approved change to the surfaces it touches: page or layout, form, measurement, experiment assignment, backend or integration, external destination, design system. Done when every surface carries its own status; a safe surface can be `READY` while an unrelated one is blocked.
3. **Design.** Record design-system constraints only where they shape the approved experience. A missing design doc means inspecting the repo's tokens and components, not a blocker.
4. **Form.** When a form is in scope, fill `form_requirements` as below.
5. **Acceptance.** Turn every approved decision into an observable acceptance criterion with its evidence type. Record `must_preserve`, `must_not_change`, risk (`low | medium | high`), rollback, and human gates for high-risk or sensitive measurement and integration changes.
6. **Check.** Fill `assets/contract.template.json` and run `node scripts/validate.mjs contract <file>`. Done when it passes and every unresolved decision sits in `blockers` or `form_requirements.unresolved`, not in prose.

Carry the decision, experiment, event, page and form identities supplied upstream unchanged. A `READY` contract holds no blockers and no implementation-critical unknown.

## Form requirements

`form_requirements` is a draft FormDefinition for `implement-forms`, with the same keys: `key`, `version`, `pattern` (`custom` when no preset fits), `path`, `location`, `page`, `conversion_event`, `contact`, `fields`, `quiz`, `consent`, `attribution`, `success`. Two keys are added: `destination` (where accepted submissions must go, stated as a requirement) and `unresolved` (open decisions). Fill what is decided, leave the rest `null`, and list it in `unresolved`.

Business and behaviour only. Tables, backend functions, ORM, attribution helpers and delivery code belong to `implement-forms` and the repository.
