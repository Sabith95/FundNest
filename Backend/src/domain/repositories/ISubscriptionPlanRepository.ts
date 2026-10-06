import { SubscriptionPlan } from "../entities/SubscriptionPlan";
import { BillingCycle } from "../../shared/constants/enums/BillingCycle";
import { PlanType } from "../../shared/constants/enums/PlanType";
import { IBaseRepository } from "./IBaseRepository";

export interface CreateSubscriptionPlanData {
  planType: PlanType;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
  hasFundSuggestions: boolean;
  isActive: boolean;
}

export interface UpdateSubscriptionPlanData {
  name?: string;
  price?: number;
  billingCycle?: BillingCycle;
  durationDays?: number;
  maxFunds?: number | null;
  maxUsers?: number | null;
  hasAutopay?: boolean;
  hasFundSuggestions?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlan> {
  findByName(name: string): Promise<SubscriptionPlan | null>;
  findByPlanType(planType: PlanType): Promise<SubscriptionPlan | null>;
  findNonDeleted(): Promise<SubscriptionPlan[]>;
  findAvailable(): Promise<SubscriptionPlan[]>;
  createPlan(data: CreateSubscriptionPlanData): Promise<SubscriptionPlan>;
  updatePlan(
    id: string,
    data: UpdateSubscriptionPlanData,
  ): Promise<SubscriptionPlan | null>;
  softDelete(id: string): Promise<SubscriptionPlan | null>;
}
