import { TenantKycTemplateResponseDto } from "../../../tenant/kyc-config/dto/TenantKycTemplateDto";

export interface IGetTenantKycTemplateUseCase {
  execute(tenantId: string): Promise<TenantKycTemplateResponseDto>;
}
