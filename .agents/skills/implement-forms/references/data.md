# Data contracts

The shapes live in `assets/`; this file holds the semantics they cannot express.

## FormDefinition

Template: `assets/form-definition.json`. It carries a stable `key` and `version`, page identity and version, `path` and `location`, `conversion_event`, `contact`, dynamic `fields`, optional `quiz`, `consent`, `attribution` profile and `success` behaviour.

- **Contact**: default `name_mode: "first_last"` (`first_name` + `last_name` + `email`). Use `"full_name"` when a single name field is preferred. Phone and other contact fields are added and marked required per form.
- **Pattern** is a descriptive preset from an open list, and never decides route or placement:
  - `generic`: contact form with arbitrary business fields;
  - `guide`: contact plus optional qualification fields;
  - `programme`: programme, campus, intake, funding or message fields, dynamic unless the domain model makes them canonical;
  - `quiz`: question IDs, answers and outputs stay dynamic, see `assets/form-definition.quiz.json`;
  - `custom`: anything else.
- **Placement**: use the requested or existing path and section. With no placement given, the hero may be proposed when the page already has one; a hero is never created just to host a form.
- Business-specific fields go in `fields` or quiz data unless the domain model proves them canonical.

## Submission

Template: `assets/submission.json` (`CanonicalLeadSubmission`). It holds the schema version, `event_id`, server `created_at`, form and page identity, `conversion_event`, normalized contact, top-level projections, and `payload_json` with `form`, `attribution`, `consent`, `technical` and `experiments`.

Top-level projections (channel, UTMs, click IDs, entry URL, referrer, analytics ID, consent flags) equal their nested values in `payload_json`. The validator enforces this.

## Attribution

Capture the entry URL and referrer, UTMs (standard and extended), click IDs (`gclid`, `gbraid`, `wbraid`, `fbclid`, `fbc`, `fbp`, `ttclid`, `ttp`), platform campaign and ad IDs, and the analytics IDs available in the repo.

- Model: session-aware, last non-empty value (`session_last_non_empty`), reusing the repo's existing capture when it has one.
- Re-capture at submit so late URL or consent changes are reflected.
- When `fbclid` is present and the `_fbc` cookie is absent, build `fbc` as `fb.1.<first-seen timestamp in ms>.<fbclid>`.
- Keep known values; leave unknown ones `null`.

## Consent

Persist the consent state used for this submission: source, method, version, timestamp, region, raw stamp and parse error when available. The `consent_marketing` and `consent_analytics` projections equal their nested values.

`ad_user_data` and `ad_personalization` (Google Consent Mode v2) are stored beside `marketing` and `analytics`. Read them from the consent layer; when it does not expose them, leave them `null` so delivery treats them as unknown.

Consent comes from the consent layer or explicit form fields. The presence of a tracking identifier is never consent.

## Request metadata

Authoritative IP and user agent come from the trusted boundary only. A hidden input never stands in for them; if the boundary cannot observe them, record them unavailable. When IP hashing is required, hash with a secret salt at the boundary and persist only the hash.
