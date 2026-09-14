# Analytics reference

The website sends server-side PostHog events through
`apps/website/src/server/posthog.ts`. The client is created for each server operation
and flushes immediately, which is appropriate for Cloudflare Workers.

Instrumented events:

- PostHog `identify` calls for authenticated server operations
- `checkout_initiated` when a Polar checkout is created
- `checkout_succeeded` after a successful checkout is validated
- `subscription_collected` when an active subscription is retrieved
- `customer_portal_opened` when a customer opens the Polar portal

Exceptions in payment and portal flows are also reported. Production requires
the `POSTHOG_API_KEY` and `POSTHOG_HOST` Cloudflare secrets to be configured
manually. Never add their values to repository documentation or source files.

The existing PostHog project contains the payment funnel, checkout, portal, and
active-subscriber insights created during initial setup. Treat the application
event names above as the durable interface; dashboards may evolve separately.
