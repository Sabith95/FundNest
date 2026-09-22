export interface UsageMetric {
  used: number;
  limit: number | null; // null represents Unlimited
}

export interface SubscriptionUsage {
  funds: UsageMetric;
  users: UsageMetric;
  hasAutopay: boolean;
  hasFundSuggestions: boolean;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  planName: string;
  amount: number;
  currency: string;
  status: "PAID" | "FAILED" | "PENDING";
  razorpayPaymentId: string;
  razorpayOrderId: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface TenantBillingOverview {
  currentPlan: {
    planId: string;
    planName: string;
    planType: string;
    price: number;
    billingCycle: string;
    startsAt: string;
    endsAt: string;
    status: "ACTIVE" | "EXPIRED";
    razorpayPaymentId: string;
  } | null;
  usage: SubscriptionUsage;
  invoices: InvoiceRecord[];
}