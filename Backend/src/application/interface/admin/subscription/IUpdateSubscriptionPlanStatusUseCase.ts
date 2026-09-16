import { SubscriptionPlanResponseDto } from "../../../admin/subscription/dto/SubscriptionPlanDto";

export interface IUpdateSubscriptionPlanStatusUseCase {
  execute(
    planId: string,
    isActive: boolean,
  ): Promise<SubscriptionPlanResponseDto>;
}
