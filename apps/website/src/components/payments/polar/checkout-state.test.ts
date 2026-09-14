import { describe, expect, it, vi } from "vitest";
import { resolveCheckoutState } from "./checkout-state";

const checkoutId = "550e8400-e29b-41d4-a716-446655440000";

describe("checkout polling state", () => {
  it("keeps processing while Polar has not succeeded", async () => {
    const result = await resolveCheckoutState(checkoutId, false, {
      validatePayment: async () => ({ data: false }),
      collectSubscription: async () => ({ data: null }),
    });
    expect(result).toEqual({ status: "processing", paymentConfirmed: false });
  });

  it("keeps processing until the subscription is available", async () => {
    const result = await resolveCheckoutState(checkoutId, false, {
      validatePayment: async () => ({ data: true }),
      collectSubscription: async () => ({ data: null }),
    });
    expect(result).toEqual({ status: "processing", paymentConfirmed: true });
  });

  it("succeeds after payment and subscription confirmation", async () => {
    const result = await resolveCheckoutState(checkoutId, false, {
      validatePayment: async () => ({ data: true }),
      collectSubscription: async () => ({ data: { id: "subscription" } }),
    });
    expect(result).toEqual({ status: "success", paymentConfirmed: true });
  });

  it("reports action failures", async () => {
    const result = await resolveCheckoutState(checkoutId, false, {
      validatePayment: async () => ({ error: { message: "Unauthorized" } }),
      collectSubscription: async () => ({ data: null }),
    });
    expect(result).toEqual({ status: "error", paymentConfirmed: false });
  });

  it("does not validate an already confirmed payment again", async () => {
    const validatePayment = vi.fn(async () => ({ data: true }));
    const collectSubscription = vi
      .fn()
      .mockResolvedValueOnce({ data: null })
      .mockResolvedValueOnce({ data: { id: "subscription" } });

    const first = await resolveCheckoutState(checkoutId, false, {
      validatePayment,
      collectSubscription,
    });
    const second = await resolveCheckoutState(
      checkoutId,
      first.paymentConfirmed,
      { validatePayment, collectSubscription },
    );

    expect(second.status).toBe("success");
    expect(validatePayment).toHaveBeenCalledTimes(1);
  });
});
