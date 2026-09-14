# Polar Integration Setup

*Payment & Subscription Guide*

Integrate Polar for subscription management and payment processing with Astro Actions

## Overview

[Polar](https://polar.sh) is a modern subscription platform designed for developers and creators. This integration provides a complete subscription management system using Polar's API without requiring webhooks or external database tables for payment tracking.

The setup includes:

- **Product Management** - Create and manage subscription products through Polar dashboard
- **Checkout Flow** - Generate secure payment links for subscription purchases
- **Subscription Tracking** - Monitor subscription status through Polar's API
- **Feature Management** - Control features based on product metadata
- **Pure API Integration** - No webhooks or external payment tables required

> **API Documentation:** Complete API reference available at [polar.sh/docs/api-reference/introduction](https://polar.sh/docs/api-reference/introduction)

---

## Step 1: Polar API Setup

Before integrating Polar into your application, you'll need to set up your Polar account and obtain the necessary API credentials.

### 1. Create Polar Account

1. Visit [polar.sh](https://polar.sh) and create an account
2. Navigate to your organization settings
3. Generate an API access token under "API Keys"

### 2. Configure Environment Variables

```bash
# .env
POLAR_SECRET="your-polar-api-access-token"
```

> **Sandbox vs Production:** Use Polar's sandbox environment for development and testing. Switch to production server for live applications.

---


## Step 2: Server-only Polar client

Create the SDK client in `apps/website/src/server/polar.ts`. Server modules read the Cloudflare binding directly; no global middleware or custom server entry is required.

```ts
import { env } from "cloudflare:workers";
import { Polar } from "@polar-sh/sdk";

export function createPolarClient() {
  return new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: env.POLAR_MODE === "production" ? "production" : "sandbox",
  });
}
```

## Step 3: Payment operations and Astro Actions

Keep reusable payment behavior in `src/server/payments.ts`. Every operation receives the incoming request, validates input with Zod, and calls `requireSession(request)` before accessing Polar.

The module preserves these operations:

- `getProducts`
- `createPaymentLink`
- `validPayment`
- `collectSubscription`
- customer portal creation for the portal endpoint

`createPaymentLink` forwards the customer identity, success URL, and client IP when Cloudflare or a proxy makes it available. The PostHog events remain `checkout_initiated`, `checkout_succeeded`, `subscription_collected`, and `customer_portal_opened`.

Browser-triggered operations are exposed through validated Astro Actions:

```ts
// apps/website/src/actions/payments.ts
export const createPaymentLink = defineAction({
  input: z.object({ productId: z.string().min(1) }),
  handler: async (input, context) => {
    return runProtected(() =>
      createPaymentLinkFromServer(
        context.request,
        input,
        context.clientAddress,
      ),
    );
  },
});

export const validPayment = defineAction({
  input: z.object({ checkoutId: z.uuid() }),
  handler: async ({ checkoutId }, context) =>
    runProtected(() => validPaymentFromServer(context.request, checkoutId)),
});
```

The action boundary maps missing sessions to an unauthorized Action error. Server-rendered subscription and checkout routes call the same helpers directly.

## Step 4: Product Configuration

Configure your subscription products in the Polar dashboard with metadata to control application features.

### Product Metadata Setup

![Polar Product Metadata](/polar-product-metadata.png)

Products support custom metadata that can be used to control feature access in your application:

```json
{
  "features": {
    "analytics": true,
    "api_access": true,
    "priority_support": true,
    "custom_branding": false
  },
  "limits": {
    "projects": 10,
    "storage_gb": 100,
    "api_calls_per_month": 10000
  }
}
```

### Benefits of Metadata-Driven Features

- **Dynamic Feature Control** - Enable/disable features based on subscription tier
- **No Database Required** - Feature configuration stored in Polar, not your database
- **Real-time Updates** - Changes to product metadata apply immediately
- **Flexible Pricing** - Easy to create different tiers with varying feature sets

---

## Step 5: Client-Side Integration

Create React components to handle the subscription flow and display products.

### Product Display Component

```typescript
// src/components/payments/polar/product-list.tsx
import { getProducts } from "@/core/functions/payments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductList() {
  const products = await getProducts();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {product.description}
            </p>
            <div className="text-2xl font-bold mb-4">
              ${product.prices[0]?.priceAmount / 100}/mo
            </div>
            <SubscribeButton productId={product.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Subscription Button Component

```typescript
// src/components/payments/polar/subscribe-button.tsx
import { createPaymentLink } from "@/core/functions/payments";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SubscribeButtonProps {
  productId: string;
}

export function SubscribeButton({ productId }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const checkout = await createPaymentLink({ productId });
      window.location.href = checkout.url;
    } catch (error) {
      console.error("Failed to create payment link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Creating checkout..." : "Subscribe"}
    </Button>
  );
}
```

### Feature Access Hook

```typescript
// src/hooks/use-subscription-features.ts
import { collectSubscription } from "@/core/functions/payments";
import { useMemo } from "react";

export function useSubscriptionFeatures() {
  const subscription = await collectSubscription();

  const features = useMemo(() => {
    if (!subscription || !subscription.product.metadata) {
      return {};
    }

    const metadata = JSON.parse(subscription.product.metadata);
    return metadata.features || {};
  }, [subscription]);

  const hasFeature = (featureName: string) => {
    return features[featureName] === true;
  };

  return {
    subscription,
    features,
    hasFeature,
    isSubscribed: !!subscription,
  };
}
```

---


## Step 6: Checkout success handler

The checkout success page is rendered on demand. It validates `checkout_id` with Zod in Astro frontmatter, rejects an invalid value without calling Polar, and hydrates only a small React status island.

```astro
---
// apps/website/src/pages/app/polar/checkout/success.astro
export const prerender = false;
const session = await getSession(Astro.request);
if (!session) return Astro.redirect("/app");

const parsed = checkoutIdSchema.safeParse(
  Astro.url.searchParams.get("checkout_id"),
);
const initialStatus = parsed.success ? "processing" : "error";
---

<CheckoutStatus
  checkoutId={parsed.success ? parsed.data : "invalid"}
  initialStatus={initialStatus}
  client:load
/>
```

While the state is `processing`, the island polls the `validPayment` Action and then `collectSubscription`. It clears its timer on unmount and preserves the exact `processing`, `success`, and `error` states.

## Architecture Benefits

### Pure API Integration

This setup uses Polar's API exclusively without requiring:

- **No Webhooks** - Direct API calls for real-time subscription status
- **No Payment Tables** - Subscription data managed entirely by Polar
- **No Complex State Management** - Subscription status fetched on-demand

### Simplified Feature Management

- **Metadata-Driven** - Features controlled through product metadata in Polar dashboard
- **Real-time Updates** - Feature changes apply immediately without code deployments
- **Flexible Tiers** - Easy to create and modify subscription tiers

### Security & Reliability

- **Server-Side Processing** - All payment operations handled on server
- **IP Tracking** - Customer IP captured for fraud prevention
- **Type Safety** - Full TypeScript support throughout the integration

---

**Polar Integration Complete!** Your application now has a fully functional subscription system with Polar handling payments, subscription management, and feature access control through a clean API-only integration.
