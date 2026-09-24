import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { ITenantKycTemplateRepository } from "../../../../domain/repositories/ITenantKycTemplateRepository";
import { ITenantRepository } from "../../../../domain/repositories/ITenantRepository";
import { IConfigureTenantKycTemplateUseCase } from "../../../interface/tenant/kyc-config/IConfigureTenantKycTemplateUseCase";
import {
  ConfigureTenantKycTemplateDto,
  TenantKycTemplateResponseDto,
} from "../dto/TenantKycTemplateDto";
import { TenantKycTemplateDtoMapper } from "../../../mapper/TenantKycTemplateDtoMapper";
import { TenantKycTemplate } from "../../../../domain/entities/TenantKycTemplate";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class ConfigureTenantKycTemplateUseCase implements IConfigureTenantKycTemplateUseCase {
  constructor(
    @inject(TOKENS.TenantKycTemplateRepository)
    private readonly _kycTemplateRepository: ITenantKycTemplateRepository,

    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  public async execute(
    tenantId: string,
    dto: ConfigureTenantKycTemplateDto,
  ): Promise<TenantKycTemplateResponseDto> {
    const tenant = await this._tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    if (!dto.requirements || dto.requirements.length === 0) {
      throw new BadRequestError(
        "At least one KYC requirement must be configured",
      );
    }

    const existing = await this._kycTemplateRepository.findByTenantId(tenantId);

    const template =
      existing ??
      TenantKycTemplate.create({
        id: "",
        tenantId,
        name: dto.name,
        description: dto.description,
        requirements: dto.requirements,
        isActive: dto.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (existing) {
      template.updateTemplate(dto.name, dto.description, dto.requirements);
      if (dto.isActive !== undefined) {
        dto.isActive ? template.activate() : template.deactivate();
      }
    }

    const saved = await this._kycTemplateRepository.saveTemplate(template);
    return TenantKycTemplateDtoMapper.toDto(saved);
  }
}
