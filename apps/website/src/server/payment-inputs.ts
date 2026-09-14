import { z } from "astro/zod";

export const paymentLinkSchema = z.object({
  productId: z.string().min(1),
});

export const checkoutIdSchema = z.uuid();

export const checkoutValidationSchema = z.object({
  checkoutId: checkoutIdSchema,
});

export type PaymentLinkInput = z.infer<typeof paymentLinkSchema>;
