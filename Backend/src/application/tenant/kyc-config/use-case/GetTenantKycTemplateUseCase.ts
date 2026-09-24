import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { ITenantKycTemplateRepository } from "../../../../domain/repositories/ITenantKycTemplateRepository";
import { IGetTenantKycTemplateUseCase } from "../../../interface/tenant/kyc-config/IGetTenantKycTemplateUseCase";
import { TenantKycTemplateResponseDto } from "../dto/TenantKycTemplateDto";
import { TenantKycTemplateDtoMapper } from "../../../mapper/TenantKycTemplateDtoMapper";
import { KycDocumentType } from "../../../../shared/constants/enums/KycDocumentType";

@injectable()
export class GetTenantKycTemplateUseCase implements IGetTenantKycTemplateUseCase {
  constructor(
    @inject(TOKENS.TenantKycTemplateRepository)
    private readonly _kycTemplateRepository: ITenantKycTemplateRepository,
  ) {}

  public async execute(
    tenantId: string,
  ): Promise<TenantKycTemplateResponseDto> {
    const existing = await this._kycTemplateRepository.findByTenantId(tenantId);

    if (existing) {
      return TenantKycTemplateDtoMapper.toDto(existing);
    }

    // Default template recommendation for newly onboarded tenants
    return {
      id: "",
      tenantId,
      name: "Standard Investor Verification",
      description: "Default mandatory KYC policy for individual subscribers",
      isActive: true,
      requirements: [
        {
          id: "req_pan",
          documentType: KycDocumentType.PAN,
          title: "PAN Card",
          description:
            "Permanent Account Number card issued by Income Tax Dept.",
          isRequired: true,
          requiresBothSides: false,
          allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf"],
          maxFileSizeMb: 5,
        },
        {
          id: "req_aadhaar",
          documentType: KycDocumentType.AADHAAR,
          title: "Aadhaar Card",
          description:
            "Government issued identity proof with front and back sides.",
          isRequired: true,
          requiresBothSides: true,
          allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf"],
          maxFileSizeMb: 5,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
