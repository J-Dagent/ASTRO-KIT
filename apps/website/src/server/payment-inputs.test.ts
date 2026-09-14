import { describe, expect, it } from "vitest";
import { checkoutIdSchema, paymentLinkSchema } from "./payment-inputs";

describe("payment inputs", () => {
  it("accepts a non-empty Polar product id", () => {
    expect(paymentLinkSchema.parse({ productId: "starter" })).toEqual({
      productId: "starter",
    });
  });

  it("rejects an empty Polar product id", () => {
    expect(() => paymentLinkSchema.parse({ productId: "" })).toThrow();
  });

  it("accepts only UUID checkout ids", () => {
    expect(
      checkoutIdSchema.safeParse("550e8400-e29b-41d4-a716-446655440000")
        .success,
    ).toBe(true);
    expect(checkoutIdSchema.safeParse("not-a-checkout-id").success).toBe(false);
  });
});
