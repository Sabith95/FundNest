import { TenantSubscriptionResponseDto } from "../../tenant/dto/TenantSubscriptionDto";

export interface IGetCurrentTenantSubscriptionUseCase {
  execute(tenantId: string): Promise<TenantSubscriptionResponseDto | null>;
}
