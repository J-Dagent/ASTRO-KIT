# 09-wire-n8n-and-browser-tracking

## Purpose

Send the canonical server payload to n8n, record delivery state, and emit browser conversion only after persistence success.

## Inputs

- persisted lead
- Measurement/CRM contract
- Environment Delta

## Process

1. Confirm required runtime configuration is present at the correct trusted boundary.
2. Resolve the form-specific n8n webhook secret from `form_key`/form pattern using `references/environment-contract.md`; never accept a webhook URL from browser input.
3. Persist first.
4. Send canonical n8n payload from server only to the resolved webhook.
5. Record sent/failed/skipped delivery state.
6. Return persistence success to browser.
7. Push approved dataLayer/PostHog conversion and redirect.
8. Do not infer downstream platform receipt.

## Outputs

- n8n delivery
- browser dataLayer/PostHog event
- success redirect

## Test

A failed n8n request must not erase a persisted lead or be misreported as Google/Meta/TikTok delivery success. The selected form must resolve the expected form-specific webhook secret, and a missing required n8n secret must be reported before claiming the pipeline is production-ready.
