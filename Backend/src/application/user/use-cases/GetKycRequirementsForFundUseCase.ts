import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { ITenantKycTemplateRepository } from "../../../domain/repositories/ITenantKycTemplateRepository";
import { IGetKycRequirementsForFundUseCase } from "../../interface/tenant/kyc-config/IGetKycRequirementsForFundUseCase";
import { TenantKycTemplateResponseDto } from "../../tenant/kyc-config/dto/TenantKycTemplateDto";
import { TenantKycTemplateDtoMapper } from "../../mapper/TenantKycTemplateDtoMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class GetKycRequirementsForFundUseCase
  implements IGetKycRequirementsForFundUseCase
{
  constructor(
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,

    @inject(TOKENS.TenantKycTemplateRepository)
    private readonly _kycTemplateRepository: ITenantKycTemplateRepository,
  ) {}

  public async execute(fundId: string): Promise<TenantKycTemplateResponseDto | null> {
    const fund = await this._chitFundRepository.findById(fundId);
    if (!fund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }

    const template = await this._kycTemplateRepository.findByTenantId(fund.tenantId);
    if (!template || !template.isActive) {
      return null;
    }

    return TenantKycTemplateDtoMapper.toDto(template);
  }
}