import { TenantKycTemplateResponseDto } from "../../../tenant/kyc-config/dto/TenantKycTemplateDto";

export interface IGetKycRequirementsForFundUseCase {
  execute(fundId: string): Promise<TenantKycTemplateResponseDto | null>;
}
