import { Types } from "mongoose";

import { SubscriptionPlan } from "../../../domain/entities/SubscriptionPlan";
import { BillingCycle } from "../../../shared/constants/enums/BillingCycle";
import { PlanType } from "../../../shared/constants/enums/PlanType";
import { SubscriptionPlanDocument } from "../models/SubscriptionPlanModel";

export type SubscriptionPlanRecord = SubscriptionPlanDocument & {
  _id: Types.ObjectId;
};

export class SubscriptionPlanPersistenceMapper {
  static toEntity(plan: SubscriptionPlanRecord): SubscriptionPlan {
    return SubscriptionPlan.create({
      id: plan._id.toString(),
      planType: plan.planType as PlanType,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle as BillingCycle,
      durationDays: plan.durationDays,
      maxFunds: plan.maxFunds,
      maxUsers: plan.maxUsers,
      hasAutopay: plan.hasAutopay,
      hasFundSuggestions: plan.hasFundSuggestions,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    });
  }
}
