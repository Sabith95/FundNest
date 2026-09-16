import { SubscriptionPlanResponseDto } from "../../../admin/subscription/dto/SubscriptionPlanDto";

export interface IGetSubscriptionPlansUseCase {
  execute(): Promise<SubscriptionPlanResponseDto[]>;
}
