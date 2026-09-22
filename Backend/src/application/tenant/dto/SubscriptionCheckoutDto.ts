export interface CreateSubscriptionCheckoutResponseDto {
  checkoutId: string;
  razorpayKeyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: "INR";
  planName: string;
  tenant: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface VerifySubscriptionCheckoutInputDto {
  checkoutId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
