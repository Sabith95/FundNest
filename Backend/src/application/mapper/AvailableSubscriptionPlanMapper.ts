import { SubscriptionPlan } from "../../domain/entities/SubscriptionPlan";
import { AvailableSubscriptionPlanDto } from "../tenant/dto/AvailableSubscriptionPlanDto";

export class AvailableSubscriptionPlanMapper {
  static toDto(plan: SubscriptionPlan): AvailableSubscriptionPlanDto {
    return {
      id: plan.id,
      planType: plan.planType,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      durationDays: plan.durationDays,
      maxFunds: plan.maxFunds,
      maxUsers: plan.maxUsers,
      hasAutopay: plan.hasAutopay,
      hasFundSuggestions: plan.hasFundSuggestions,
    };
  }
}
