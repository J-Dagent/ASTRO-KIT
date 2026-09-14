# Canonical attribution contract

This contract is strict. Capture vendor inputs flexibly; normalize them into one stable Acadelead shape.

## Capture model

Preserve the useful behavior observed in the supplied handoff:
- capture on initial mount/navigation when relevant;
- persist acquisition context for the session;
- recapture at submit so late consent/URL changes are reflected;
- last non-empty URL value wins for campaign/click parameters within the session;
- preserve first landing page URL and first non-empty referrer;
- normalize missing keys to `null` in the canonical object when serializing;
- never trust hidden DOM inputs as the source of truth.

If the project needs multi-session attribution, define that as a separate approved model rather than silently changing this session contract.

## Canonical object

```json
{
  "attribution": {
    "schema_version": "1.0",
    "captured_at": null,
    "capture_model": "session_last_non_empty",
    "channel": null,
    "entry": {
      "landing_page_url": null,
      "referrer": null
    },
    "utm": {
      "source": null,
      "medium": null,
      "campaign": null,
      "content": null,
      "term": null,
      "id": null,
      "offer": null,
      "persona": null,
      "stage": null,
      "angle": null,
      "hook": null,
      "format": null,
      "country": null
    },
    "google": {
      "gclid": null,
      "gbraid": null,
      "wbraid": null,
      "campaign_id": null,
      "ad_group_id": null,
      "ad_id": null,
      "keyword": null,
      "match_type": null,
      "device": null,
      "network": null
    },
    "meta": {
      "fbclid": null,
      "fbc": null,
      "fbp": null,
      "campaign_id": null,
      "ad_set_id": null,
      "ad_id": null,
      "placement": null,
      "device": null
    },
    "tiktok": {
      "ttclid": null,
      "ttp": null,
      "campaign_id": null,
      "ad_group_id": null,
      "ad_id": null,
      "placement": null,
      "device": null
    },
    "analytics": {
      "posthog_distinct_id": null,
      "posthog_session_id": null,
      "ga_client_id": null,
      "ga_session_id": null
    }
  }
}
```

## Indexed projection columns

Project these canonical values to columns/fields for common reporting and routing:
- `channel`;
- UTM standard: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`;
- Google: `gclid`, `gbraid`, `wbraid`;
- Meta: `fbclid`, `fbc`, `fbp`;
- TikTok: `ttclid`, `ttp`;
- `landing_page_url`, `referrer`, `posthog_distinct_id`.

Keep rich vendor campaign metadata inside `payload_json.attribution` unless a proven query/reporting need justifies promotion.

## Input aliases

Normalize known incoming variants. At minimum support the current/project conventions when present:
- Google campaign: `campaign_id`, `gad_campaignid`, configured campaign aliases;
- Google ad group: `ad_group_id`, `utm_adgroup` and configured aliases;
- Google match type: `match_type`, `matchtype`;
- Meta ad set: `adset_id`, `ad_set_id` → `meta.ad_set_id`;
- TikTok ad group: `adgroup_id`, `ad_group_id` → `tiktok.ad_group_id`.

Do not let a generic `campaign_id`, `ad_id`, `placement`, or `device` overwrite another platform's namespace without evidence of the active source.

## Cookies and click IDs

Current/source behavior includes Meta `_fbc`/`_fbp` and click IDs. Target support also includes TikTok `_ttp` when present and consent permits capture.

- Never synthesize vendor identifiers when consent/policy forbids it.
- If generating `fbc` from `fbclid` is retained, do so only under the approved consent policy.
- Do not expose secrets in browser attribution logic.

## Channel classification

Derive `channel` from click IDs, UTM and referrer at a trusted normalization seam. Suggested stable values:
`google_ads`, `meta_ads`, `tiktok_ads`, `organic_search`, `email`, `referral`, `direct`, `other`.

Document precedence and test it. Do not treat this derived field as the raw source of truth.
