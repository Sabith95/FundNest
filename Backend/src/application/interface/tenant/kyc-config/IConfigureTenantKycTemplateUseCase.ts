import {
  ConfigureTenantKycTemplateDto,
  TenantKycTemplateResponseDto,
} from "../../../tenant/kyc-config/dto/TenantKycTemplateDto";

export interface IConfigureTenantKycTemplateUseCase {
  execute(
    tenantId: string,
    dto: ConfigureTenantKycTemplateDto,
  ): Promise<TenantKycTemplateResponseDto>;
}
