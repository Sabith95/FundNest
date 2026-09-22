import { VerifySubscriptionCheckoutInputDto } from "../../tenant/dto/SubscriptionCheckoutDto";
import { TenantSubscriptionResponseDto } from "../../tenant/dto/TenantSubscriptionDto";

export interface IVerifySubscriptionCheckoutUseCase {
  execute(
    tenantId: string,
    input: VerifySubscriptionCheckoutInputDto,
  ): Promise<TenantSubscriptionResponseDto>;
}
