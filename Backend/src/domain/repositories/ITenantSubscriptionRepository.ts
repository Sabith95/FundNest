import { TenantSubscription } from "../entities/TenantSubscription";
import { IBaseRepository } from "./IBaseRepository";

export interface UpsertSubscriptionData {
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
  startsAt: Date;
  endsAt: Date;
  status: "ACTIVE";
  razorpayOrderId: string;
  razorpayPaymentId: string;
}

export interface ITenantSubscriptionRepository extends IBaseRepository<TenantSubscription> {
  findByTenantId(tenantId: string): Promise<TenantSubscription | null>;
  findActiveByTenantId(tenantId: string): Promise<TenantSubscription | null>;
  countActiveByPlanId(planId: string): Promise<number>;
  upsertSubscription(data: UpsertSubscriptionData): Promise<TenantSubscription>;
  markAsExpired(id: string): Promise<void>;
}