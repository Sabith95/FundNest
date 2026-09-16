import {
  SubscriptionPlanResponseDto,
  UpdateSubscriptionPlanDto,
} from "../../../admin/subscription/dto/SubscriptionPlanDto";

export interface IUpdateSubscriptionPlanUseCase {
  execute(
    planId: string,
    data: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlanResponseDto>;
}
