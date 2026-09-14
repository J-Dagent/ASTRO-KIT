export type CheckoutState = "processing" | "success" | "error";

type OperationResult<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: { message: string } };

interface CheckoutOperations {
  validatePayment: (checkoutId: string) => Promise<OperationResult<boolean>>;
  collectSubscription: () => Promise<OperationResult<unknown | null>>;
}

export async function resolveCheckoutState(
  checkoutId: string,
  paymentConfirmed: boolean,
  operations: CheckoutOperations,
): Promise<{ status: CheckoutState; paymentConfirmed: boolean }> {
  try {
    let confirmed = paymentConfirmed;
    if (!confirmed) {
      const payment = await operations.validatePayment(checkoutId);
      if (payment.error) return { status: "error", paymentConfirmed: false };
      if (!payment.data) {
        return { status: "processing", paymentConfirmed: false };
      }
      confirmed = true;
    }

    const subscription = await operations.collectSubscription();
    if (subscription.error) {
      return { status: "error", paymentConfirmed: confirmed };
    }
    return {
      status: subscription.data ? "success" : "processing",
      paymentConfirmed: confirmed,
    };
  } catch {
    return { status: "error", paymentConfirmed };
  }
}
