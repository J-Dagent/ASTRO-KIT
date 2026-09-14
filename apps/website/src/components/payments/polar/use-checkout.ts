import { useState } from "react";
import { actions } from "astro:actions";

export function useCheckout() {
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const redirectToCheckout = async (productId: string) => {
    setIsCheckoutPending(true);
    setError(null);
    try {
      const result = await actions.createPaymentLink({ productId });
      if (result.error) {
        setError(new Error(result.error.message));
        setIsCheckoutPending(false);
        return;
      }
      window.location.href = result.data.url;
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error("Checkout failed"));
      setIsCheckoutPending(false);
    }
  };

  return {
    redirectToCheckout,
    isCheckoutPending,
    error,
  };
}
