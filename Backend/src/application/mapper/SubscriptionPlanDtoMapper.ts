import { SubscriptionPlan } from "../../domain/entities/SubscriptionPlan";
import { SubscriptionPlanResponseDto } from "../admin/subscription/dto/SubscriptionPlanDto";

export class SubscriptionPlanResponseDtoMapper {
  static toDto(plan: SubscriptionPlan): SubscriptionPlanResponseDto {
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
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
