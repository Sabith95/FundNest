import { TenantProfileResponseDto } from "../../tenant/dto/TenantProfileResponseDto";

export interface IGetTenantProfileUseCase {
  execute(tenantId: string): Promise<TenantProfileResponseDto>;
}