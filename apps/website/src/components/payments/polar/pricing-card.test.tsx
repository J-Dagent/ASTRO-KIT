import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PricingCard } from "./pricing-card";
import type { Product } from "./types";

function product(overrides: Partial<Product>): Product {
  return {
    id: "prod_1",
    name: "Pro",
    description: null,
    isRecurring: true,
    recurringInterval: "month",
    metadata: {},
    prices: [
      {
        id: "price_1",
        productId: "prod_1",
        amountType: "fixed",
        priceCurrency: "eur",
        priceAmount: 1900,
      },
    ],
    ...overrides,
  } as Product;
}

function render(item: Product) {
  return renderToStaticMarkup(
    <PricingCard
      product={item}
      subscription={null}
      onCheckout={() => {}}
      isCheckoutPending={false}
    />,
  );
}

describe("PricingCard", () => {
  it("formats a recurring fixed price with its interval from the product", () => {
    const html = render(product({}));

    expect(html).toContain("19,00");
    expect(html).toContain("par month");
  });

  it("does not show an interval for a one-time product", () => {
    const html = render(product({ isRecurring: false, recurringInterval: null }));

    expect(html).not.toContain("par ");
  });
});
