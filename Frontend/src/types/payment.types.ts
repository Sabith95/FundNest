interface BasePaymentDetails {
  planName?: string;
  planId?: string;
  amount?: number;
  currency?: string;
}

export interface PaymentSuccessDetails extends BasePaymentDetails {
  status: "success";
  transactionId: string;
  paidAt?: string;
}

export interface PaymentFailureDetails extends BasePaymentDetails {
  status: "failed";
  reason?: string;
  errorCode?: string;
}

export type PaymentResult = PaymentSuccessDetails | PaymentFailureDetails;
