import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { ITenantKycTemplateRepository } from "../../../domain/repositories/ITenantKycTemplateRepository";
import { IGetKycRequirementsForFundUseCase } from "../../interface/tenant/kyc-config/IGetKycRequirementsForFundUseCase";
import { TenantKycTemplateResponseDto } from "../../tenant/kyc-config/dto/TenantKycTemplateDto";
import { TenantKycTemplateDtoMapper } from "../../mapper/TenantKycTemplateDtoMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";

import { KycDocumentType } from "../../../shared/constants/enums/KycDocumentType";

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
    if (!template || !template.isActive || !template.requirements?.length) {
      return {
        id: "standard-kyc-template",
        tenantId: fund.tenantId,
        name: "Standard Regulatory KYC Requirements",
        description: "Official subscriber identity verification required by chit fund regulations.",
        isActive: true,
        requirements: [
          {
            id: "std-aadhaar",
            documentType: KycDocumentType.AADHAAR,
            title: "Aadhaar Card / Government ID",
            description: "Clear photo or PDF copy of your Aadhaar card or government-issued photo ID.",
            isRequired: true,
            requiresBothSides: true,
            allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf"],
            maxFileSizeMb: 5,
          },
          {
            id: "std-pan",
            documentType: KycDocumentType.PAN,
            title: "PAN Card",
            description: "Permanent Account Number (PAN) card for transaction compliance.",
            isRequired: true,
            requiresBothSides: false,
            allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf"],
            maxFileSizeMb: 5,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return TenantKycTemplateDtoMapper.toDto(template);
  }
}