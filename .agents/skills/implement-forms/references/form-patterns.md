# Form patterns

Use three reusable form patterns. They are functional/data presets, not fixed visual templates.

## Guide / lead magnet
Default path family: `/guide` (preserve existing routes when migrating).

Observed source pattern:
- hero-integrated form card;
- contact fields plus optional qualification field(s);
- attribution/consent captured at mount and recaptured at submit;
- backend persistence succeeds before browser conversion and thank-you redirect.

Target rule:
- canonical contact fields are explicit;
- all client-specific qualification fields remain dynamic in `payload_json.form.fields`;
- do not hard-code any client-specific qualification field into the generic model.

## Quiz
Default path family: `/quiz`.

Observed source pattern:
- question-by-question hero card;
- local progress and back navigation;
- arbitrary answers collected before final contact step;
- client-specific scoring/segmentation outputs;
- final contact submission uses the same backend pipeline.

Target rule:
```json
{
  "quiz": {
    "quiz_key": "...",
    "quiz_version": "...",
    "answers": { "<question_id>": "<answer_value>" },
    "outputs": { "<output_key>": "<output_value>" }
  }
}
```
Question IDs, answers and outputs are client-defined. Never create quiz-specific database columns.

## Formation / programme
Default target path family: `/formation/<slug>`; preserve an existing production route when migrating.

Observed source pattern:
- hero-integrated generic form card;
- contact fields plus optional message/client fields;
- an observed legacy implementation used generic page configuration with hidden business defaults; treat such defaults as configuration-derived, not user answers.

Target rule:
- programme, campus, intake, funding, message, eligibility and similar fields are dynamic;
- for Google search traffic, preserve query/ad/page/form message match and full Google attribution;
- Meta/TikTok use the same canonical form/data pipeline with different attribution branches.

## UI freedom
Do not require exact component names. Reuse or improve existing Astro components and React islands. The invariant is behavior and data flow, not a legacy component tree.
