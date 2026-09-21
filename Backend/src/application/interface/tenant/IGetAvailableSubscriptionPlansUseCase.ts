import { AvailableSubscriptionPlanDto } from "../../tenant/dto/AvailableSubscriptionPlanDto";

export interface IGetAvailableSubscriptionPlansUseCase {
  execute(): Promise<AvailableSubscriptionPlanDto[]>;
}
