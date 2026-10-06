import { SubscriptionPlanResponseDto } from "../../../admin/subscription/dto/SubscriptionPlanDto";

export interface IDeleteSubscriptionPlanUseCase {
  execute(planId: string): Promise<SubscriptionPlanResponseDto>;
}
