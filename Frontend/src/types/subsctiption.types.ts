export type PlanType = string;

export type BillingCycle = "MONTHLY" | "YEARLY";

export interface SubscriptionPlan {
  id: string;
  planType: PlanType;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanPayload {
  planType: PlanType;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
}

export interface UpdateSubscriptionPlanPayload {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
}

export interface AdminBillingRecord {
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
  startsAt: string;
  renewalDate: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
}