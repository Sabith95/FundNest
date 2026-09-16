import {
  CreateSubscriptionPlanDto,
  SubscriptionPlanResponseDto,
} from "../../../admin/subscription/dto/SubscriptionPlanDto";

export interface ICreateSubscriptionPlanUseCase {
  execute(
    data: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlanResponseDto>;
}
