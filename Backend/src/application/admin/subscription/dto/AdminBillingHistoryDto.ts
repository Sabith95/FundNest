export interface AdminBillingRecordDto {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  planName: string;
  planType: string;
  billingCycle: string;
  amount: number;
  currency: string;
  status: "ACTIVE" | "EXPIRED" | "PAID" | "FAILED";
  startsAt: Date;
  renewalDate: Date;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: Date;
}
