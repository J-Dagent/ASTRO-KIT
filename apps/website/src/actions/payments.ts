import { ActionError, defineAction } from "astro:actions";
import { UnauthorizedError } from "@/server/auth";
import {
  checkoutValidationSchema,
  paymentLinkSchema,
} from "@/server/payment-inputs";
import {
  collectSubscription as collectSubscriptionFromServer,
  createPaymentLink as createPaymentLinkFromServer,
  getProducts as getProductsFromServer,
  validPayment as validPaymentFromServer,
} from "@/server/payments";

async function runProtected<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new ActionError({ code: "UNAUTHORIZED", message: error.message });
    }
    throw error;
  }
}

export const getProducts = defineAction({
  handler: async (_input, context) =>
    runProtected(() => getProductsFromServer(context.request)),
});

export const createPaymentLink = defineAction({
  input: paymentLinkSchema,
  handler: async (input, context) => {
    let clientAddress: string | undefined;
    try {
      clientAddress = context.clientAddress;
    } catch {
      clientAddress = undefined;
    }

    return runProtected(() =>
      createPaymentLinkFromServer(context.request, input, clientAddress),
    );
  },
});

export const validPayment = defineAction({
  input: checkoutValidationSchema,
  handler: async ({ checkoutId }, context) =>
    runProtected(() => validPaymentFromServer(context.request, checkoutId)),
});

export const collectSubscription = defineAction({
  handler: async (_input, context) =>
    runProtected(() => collectSubscriptionFromServer(context.request)),
});
