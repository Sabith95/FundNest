import { KycDocumentType } from "../../../../shared/constants/enums/KycDocumentType";

export interface KycRequirementDto {
  id: string;
  documentType: KycDocumentType;
  title: string;
  description?: string;
  isRequired: boolean;
  requiresBothSides: boolean;
  allowedMimeTypes: string[];
  maxFileSizeMb: number;
}

export interface TenantKycTemplateResponseDto {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  requirements: KycRequirementDto[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigureTenantKycTemplateDto {
  name: string;
  description?: string;
  requirements: KycRequirementDto[];
  isActive?: boolean;
}
