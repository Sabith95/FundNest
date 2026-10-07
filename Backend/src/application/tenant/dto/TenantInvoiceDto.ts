export interface TenantInvoiceResponseDto {
  id: string;
  invoiceNumber: string;
  planName: string;
  planType: string;
  amount: number;
  currency: string;
  billingCycle: string;
  status: "PAID" | "FAILED" | "PENDING";
  razorpayPaymentId: string;
  razorpayOrderId: string;
  date: Date;
  periodStart?: Date;
  periodEnd?: Date;
  createdAt: Date;
}
