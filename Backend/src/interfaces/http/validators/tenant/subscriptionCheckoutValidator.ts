import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier");

export const createSubscriptionCheckoutSchema = z.object({
  planId: objectId,
});

export const verifySubscriptionCheckoutSchema = z.object({
  checkoutId: objectId,
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});
