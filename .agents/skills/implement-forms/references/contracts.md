# Contracts

The JSON templates are the exact machine-checkable shape. Keep prose here to semantics the templates cannot express.

## FormDefinition

Use `assets/form-definition.template.json` as the baseline. Required concepts are:
- stable `key` and `version`;
- page identity/version and location;
- `conversion_event`;
- contact configuration;
- dynamic `fields`;
- consent and attribution configuration;
- success behavior;
- optional quiz configuration.

`pattern` is descriptive, not an architecture switch. Existing examples for guide, quiz, and programme flows are presets, not an exhaustive enum.

Business-specific fields belong in `fields` or quiz data unless they are proven canonical domain fields.

## CanonicalLeadSubmission

Use `assets/canonical-lead-submission.template.json` as the source of truth. Preserve:
- schema/version and `event_id`;
- server timestamp;
- form/page identity and conversion event;
- normalized contact projections;
- canonical attribution projections;
- consent projections;
- `payload_json.form`, `payload_json.attribution`, `payload_json.consent`, `payload_json.technical`, and `payload_json.experiments`.

Top-level projections must equal their canonical values inside `payload_json`. The validator enforces this.

## Attribution

Capture the canonical attribution object, including entry URL/referrer, UTM data, supported ad click identifiers, and analytics identifiers available to the repository. Preserve known values; do not invent missing ones.

Use a session-aware capture model when the repo already has one. Re-capture at submit when required so late URL or consent changes are reflected.

Never trust hidden inputs for authoritative request metadata.

## Consent

Persist the consent state used for the submission, including source/method/version/timestamp when available. Marketing and analytics projections must match the canonical consent object.

Do not infer consent from the mere presence of tracking identifiers.

## Form presets

- Guide/contact: contact plus optional qualification fields.
- Quiz: arbitrary answer IDs and outputs remain dynamic.
- Programme: programme/campus/intake/funding/message fields remain dynamic unless the domain model says otherwise.

Preserve existing production routes when migrating a form.
