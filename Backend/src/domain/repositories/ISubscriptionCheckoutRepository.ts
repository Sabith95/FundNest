import { SubscriptionCheckout } from "../entities/SubscriptionCheckout";
import { IBaseRepository } from "./IBaseRepository";

export interface CreateCheckoutData {
  tenantId: string;
  planId: string;
  planName: string;
  planType: string;
  amount: number;
  currency: "INR";
  billingCycle: string;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
  hasFundSuggestions: boolean;
  razorpayOrderId: string;
  expiresAt: Date;
}

export interface ISubscriptionCheckoutRepository extends IBaseRepository<SubscriptionCheckout> {
  create(data: CreateCheckoutData): Promise<SubscriptionCheckout>;
  findByRazorpayOrderId(orderId: string): Promise<SubscriptionCheckout | null>;
  markAsPaid(
    id: string,
    paymentId: string,
    paidAt: Date,
  ): Promise<SubscriptionCheckout | null>;
  markAsFailed(id: string, failureReason: string): Promise<void>;
}
