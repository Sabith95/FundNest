import { CreateSubscriptionCheckoutResponseDto } from "../../tenant/dto/SubscriptionCheckoutDto";

export interface ICreateSubscriptionCheckoutUseCase {
  execute(
    tenantId: string,
    planId: string,
  ): Promise<CreateSubscriptionCheckoutResponseDto>;
}
