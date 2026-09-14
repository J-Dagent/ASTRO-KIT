import { Alert, AlertDescription } from "@/components/ui/alert";
import { PricingGrid } from "./pricing-grid";
import type { Products, Subscription } from "./types";
import { useCheckout } from "./use-checkout";

export function PricingPlans({ products, subscription }: {
  products: Products;
  subscription: Subscription;
}) {
  const { redirectToCheckout, isCheckoutPending, error } = useCheckout();

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <PricingGrid
        products={products}
        subscription={subscription}
        onCheckout={redirectToCheckout}
        isCheckoutPending={isCheckoutPending}
      />
    </>
  );
}
