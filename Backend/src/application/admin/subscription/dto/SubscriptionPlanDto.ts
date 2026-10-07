import { BillingCycle } from "../../../../shared/constants/enums/BillingCycle";
import { PlanType } from "../../../../shared/constants/enums/PlanType";

export interface CreateSubscriptionPlanDto {
  planType: PlanType;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
}

export interface UpdateSubscriptionPlanDto {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
}

export interface SubscriptionPlanResponseDto {
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
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}