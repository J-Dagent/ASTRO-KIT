import { env } from "cloudflare:workers";
import { requireSession } from "@/server/auth";
import {
  checkoutIdSchema,
  paymentLinkSchema,
  type PaymentLinkInput,
} from "@/server/payment-inputs";
import { createPolarClient } from "@/server/polar";
import { createPostHogClient } from "@/server/posthog";

export { checkoutIdSchema, paymentLinkSchema } from "@/server/payment-inputs";

function getRequestIp(request: Request, clientAddress?: string) {
  return (
    clientAddress ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    undefined
  );
}

export async function getProducts(request: Request) {
  await requireSession(request);
  const products = await createPolarClient().products.list({
    isArchived: false,
  });

  return products.result.items;
}

export async function createPaymentLink(
  request: Request,
  input: PaymentLinkInput,
  clientAddress?: string,
) {
  const data = paymentLinkSchema.parse(input);
  const session = await requireSession(request);
  const posthog = createPostHogClient();

  try {
    const checkout = await createPolarClient().checkouts.create({
      products: [data.productId],
      externalCustomerId: session.user.id,
      successUrl: `${env.BETTER_AUTH_URL || new URL(request.url).origin}/app/polar/checkout/success?checkout_id={CHECKOUT_ID}`,
      customerIpAddress: getRequestIp(request, clientAddress),
      customerEmail: session.user.email,
    });

    await posthog.captureImmediate({
      distinctId: session.user.id,
      event: "checkout_initiated",
      properties: {
        product_id: data.productId,
        checkout_id: checkout.id,
        checkout_url: checkout.url,
      },
    });

    return checkout;
  } catch (error) {
    await posthog.captureExceptionImmediate(error, session.user.id, {
      product_id: data.productId,
    });
    throw error;
  }
}

export async function validPayment(request: Request, checkoutId: string) {
  const id = checkoutIdSchema.parse(checkoutId);
  const session = await requireSession(request);
  const posthog = createPostHogClient();

  try {
    const payment = await createPolarClient().checkouts.get({ id });
    if (payment.status !== "succeeded") {
      return false;
    }

    await posthog.captureImmediate({
      distinctId: session.user.id,
      event: "checkout_succeeded",
      properties: {
        checkout_id: id,
        product_id: payment.productId,
      },
    });
    return true;
  } catch (error) {
    await posthog.captureExceptionImmediate(error, session.user.id, { checkout_id: id });
    throw error;
  }
}

export async function collectSubscription(request: Request) {
  const session = await requireSession(request);
  const posthog = createPostHogClient();

  try {
    const subscriptions = await createPolarClient().subscriptions.list({
      externalCustomerId: session.user.id,
    });
    const subscription = subscriptions.result.items[0] ?? null;

    if (subscription) {
      await posthog.captureImmediate({
        distinctId: session.user.id,
        event: "subscription_collected",
        properties: {
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          product_id: subscription.productId,
        },
      });
    }

    return subscription;
  } catch (error) {
    await posthog.captureExceptionImmediate(error, session.user.id);
    throw error;
  }
}

export async function createCustomerPortal(request: Request) {
  const session = await requireSession(request);
  const posthog = createPostHogClient();

  try {
    const customerSession = await createPolarClient().customerSessions.create({
      externalCustomerId: session.user.id,
    });
    await posthog.captureImmediate({
      distinctId: session.user.id,
      event: "customer_portal_opened",
      properties: {
        portal_url: customerSession.customerPortalUrl,
      },
    });
    return customerSession.customerPortalUrl;
  } catch (error) {
    await posthog.captureExceptionImmediate(error, session.user.id);
    throw error;
  }
}
