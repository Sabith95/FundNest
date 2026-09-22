export interface TenantSubscriptionResponseDto {
  id: string;
  tenantId: string;
  planId: string;
  planName: string;
  planType: string;
  amount: number;
  currency: "INR";
  startsAt: Date;
  endsAt: Date;
  status: "ACTIVE" | "EXPIRED";
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: Date;
  updatedAt: Date;
}
