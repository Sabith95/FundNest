import { TenantKycTemplate } from "../../domain/entities/TenantKycTemplate";
import { TenantKycTemplateResponseDto } from "../tenant/kyc-config/dto/TenantKycTemplateDto";

export class TenantKycTemplateDtoMapper {
  public static toDto(
    template: TenantKycTemplate,
  ): TenantKycTemplateResponseDto {
    return {
      id: template.id,
      tenantId: template.tenantId,
      name: template.name,
      description: template.description,
      requirements: template.requirements.map((req) => ({
        id: req.id,
        documentType: req.documentType,
        title: req.title,
        description: req.description,
        isRequired: req.isRequired,
        requiresBothSides: req.requiresBothSides,
        allowedMimeTypes: req.allowedMimeTypes,
        maxFileSizeMb: req.maxFileSizeMb,
      })),
      isActive: template.isActive,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }
}
