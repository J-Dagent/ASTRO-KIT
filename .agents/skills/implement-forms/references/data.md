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
- **Exits**: an answer that marks the visitor off target (another sector, a student instead of an institution) is an exit option of its field, with its own value, label and orientation message. Exit values stay out of the submission's enumerations, so no request can carry one; the browser behaviour is in [delivery.md](delivery.md#form-events-and-exits).

## Submission

Template: `assets/submission.json` (`CanonicalLeadSubmission`). It holds the schema version, `event_id`, server `created_at`, form and page identity, `conversion_event`, normalized contact, top-level projections, and `payload_json` with `form`, `attribution`, `consent`, `technical` and `experiments`.

Top-level projections (channel, UTMs, click IDs, campaign IDs, entry URL, referrer, PostHog IDs, consent flags) equal their nested values in `payload_json`. The validator enforces this. In PostgreSQL they become columns, under the template's names:

- a URL parameter keeps its URL name (`utm_source`, `gclid`, `li_fat_id`, `li_campaign_id`);
- any other ID takes its platform as prefix (`google_campaign_id`, `meta_ad_set_id`, `posthog_session_id`), since `campaign_id` alone names no source;
- a column name never holds `$`: that sign belongs to PostHog's event properties, inside `payload_json`.

## Attribution

Capture the entry URL and referrer, UTMs (standard and extended), click IDs (`gclid`, `gbraid`, `wbraid`, `fbclid`, `fbc`, `fbp`, `li_fat_id`, `ttclid`, `ttp`), platform campaign and ad IDs, and the analytics IDs available in the repo.

- **Names**: read URL parameters under the exact names the platforms and PostHog use (`utm_source`…`utm_term`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `li_fat_id`, `ttclid`), so the form's values and PostHog's `$entry_*` / `$initial_*` properties describe the same click. Custom parameters carry their platform's prefix (`li_campaign_id`).
- **Model** (`session_last_non_empty`): UTMs belong to one touch, so a new arrival with campaign parameters replaces the whole UTM set; each click ID keeps its own last non-empty value, since each one matches its own platform. `channel` comes from the latest touch alone. Reuse the repo's existing capture when it has one.
- **Persistence**: keep the state in memory for the page; write it to first-party storage only under the consent the repo's consent layer requires, and remove it on refusal or withdrawal.
- **Re-capture at submit**: URL, platform cookies and analytics IDs are read again when the form is sent, so late consent or a cookie set after arrival is reflected.
- Keep known values; leave unknown ones `null`.

### Google Ads

- Keep auto-tagging on: Google appends `gclid`, or `gbraid` / `wbraid` for iOS traffic, to the landing URL. Google's Conversion Linker keeps them in first-party cookies (`_gcl_aw` for `gclid`, `_gcl_gb` for `gbraid`, value `GCL.<timestamp>.<id>`), set only when Consent Mode grants `ad_storage`: read the URL parameter first, the cookie at submit as fallback, and keep the ID as received.
- Campaign IDs come from ValueTrack parameters in the account-level final URL suffix, under Google's own names: `campaignid={campaignid}&adgroupid={adgroupid}&creative={creative}&keyword={keyword}&matchtype={matchtype}&device={device}&network={network}`, into `attribution.google` (`campaign_id`, `ad_group_id`, `ad_id`, `keyword`, `match_type`, `device`, `network`). UTMs repeat the IDs for analytics (`utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}`); IDs, not names, since names change.
- `channel` is Google's when one of its click IDs arrives or `utm_source` is `google` with a paid medium, whichever touch is latest. An offline conversion upload needs `gclid` (or `gbraid` / `wbraid`) and the acceptance time.

### LinkedIn

- `li_fat_id` is LinkedIn's click ID (`LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID` in the Conversions API). Campaign Manager appends it to the landing URL only when enhanced conversion tracking is on, and the Insight Tag keeps it in a first-party `li_fat_id` cookie: read the URL parameter first, the cookie at submit as fallback. Keep the value as received.
- LinkedIn appends no UTM: the campaign's URL parameters carry them, with IDs from LinkedIn's dynamic values rather than names, which change. Read `li_campaign_group_id`, `li_campaign_id` and `li_creative_id` into `attribution.linkedin`; for example `utm_source=linkedin&utm_medium=paid_social&utm_campaign=<campaign slug>&utm_content={{CREATIVE_ID}}&li_campaign_group_id={{CAMPAIGN_GROUP_ID}}&li_campaign_id={{CAMPAIGN_ID}}&li_creative_id={{CREATIVE_ID}}`. Check in Campaign Manager which macro family the account exposes.
- `channel` is LinkedIn's when `li_fat_id` arrives or `utm_source` is `linkedin`, whichever touch is latest.

### Meta

- Meta appends `fbclid` to every ad click. The Pixel keeps first-party cookies `_fbc` (the click, `fb.1.<timestamp in ms>.<fbclid>`) and `_fbp` (the browser), set only when the consent layer lets the Pixel run. At submit, read `_fbc`, or build `fbc` as `fb.1.<first-seen timestamp in ms>.<fbclid>` when only `fbclid` is known; read `_fbp` from its cookie only.
- Meta appends no UTM: the ad's URL parameters carry them, with IDs from Meta's dynamic values rather than names, which change: `utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.id}}&utm_content={{ad.id}}&utm_term={{adset.id}}`. When the contract has `attribution.meta` campaign, ad set and ad IDs, add them under prefixed names (`meta_campaign_id={{campaign.id}}&meta_ad_set_id={{adset.id}}&meta_ad_id={{ad.id}}&meta_placement={{placement}}`) and read them into `campaign_id`, `ad_set_id`, `ad_id` and `placement`; otherwise the UTMs hold them.
- `channel` is Meta's when `fbclid` arrives or `utm_source` is `facebook`, `instagram` or `meta` with a paid medium, whichever touch is latest.

### PostHog

`attribution.analytics.posthog` holds PostHog's own identifiers under PostHog's own property names, read from `posthog-js` at submit and only while PostHog runs under its consent; otherwise `null`. Never derive them from another cookie or invent one.

| Key | PostHog property | Read with |
| --- | --- | --- |
| `distinct_id` | `distinct_id` (event) | `posthog.get_distinct_id()` |
| `$session_id` | `$session_id` | `posthog.get_session_id()` |
| `$device_id` | `$device_id` | `posthog.get_property("$device_id")` |

Columns follow PostHog's own SQL conventions: PostHog's exports and warehouse tables carry `distinct_id` and `session_id`, never a `$` column, and its documented join key for an external table is `posthog_distinct_id` (PostHog docs: *Postgres destination for batch exports*, *Linking PostHog as a source*, *Using Data Warehouse tables in Experiments*). Hence `posthog_distinct_id`, `posthog_session_id` and `posthog_device_id`, the prefix keeping them apart from an analytics or ad-platform session ID. In PostHog's data warehouse, join `events.distinct_id` to `posthog_distinct_id`, or `properties.$session_id` to `posthog_session_id`. These keys join a submission to PostHog's events, sessions and session attribution (`$entry_utm_source`, `$entry_li_fat_id`…); the form never calls `posthog.identify()` with contact data. PostHog files `li_fat_id` under personal data and masks it when `mask_personal_data_properties` is on.

## Consent

Persist the consent state used for this submission: source, method, version, timestamp, region, raw stamp and parse error when available. The `consent_marketing` and `consent_analytics` projections equal their nested values.

`ad_user_data` and `ad_personalization` (Google Consent Mode v2) are stored beside `marketing` and `analytics`. Read them from the consent layer; when it does not expose them, leave them `null` so delivery treats them as unknown.

Consent comes from the consent layer or explicit form fields. The presence of a tracking identifier is never consent.

## Request metadata

Authoritative IP and user agent come from the trusted boundary only. A hidden input never stands in for them; if the boundary cannot observe them, record them unavailable. When IP hashing is required, hash with a secret salt at the boundary and persist only the hash.
