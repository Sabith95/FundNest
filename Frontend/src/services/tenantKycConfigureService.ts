import axios from "axios";
import api from "./api";
import { API_ROUTES } from "../shared/apiRoutes";

/* =========================================================
   KYC DOCUMENT TYPES
========================================================= */

export const KycDocumentType = {
  AADHAAR: "AADHAAR",
  PAN: "PAN",
  PASSPORT: "PASSPORT",
  DRIVING_LICENSE: "DRIVING_LICENSE",
  VOTER_ID: "VOTER_ID",
  BANK_STATEMENT: "BANK_STATEMENT",
  SALARY_SLIP: "SALARY_SLIP",
  CUSTOM: "CUSTOM",
} as const;

export type KycDocumentType =
  (typeof KycDocumentType)[keyof typeof KycDocumentType];

/* =========================================================
   BACKEND DTOs
========================================================= */

export interface IKycRequirementDto {
  id: string;
  documentType: KycDocumentType;
  title: string;
  description?: string;
  isRequired: boolean;
  requiresBothSides: boolean;
  allowedMimeTypes: string[];
  maxFileSizeMb: number;
}

export interface ITenantKycTemplateDto {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  requirements: IKycRequirementDto[];
  createdAt: string;
  updatedAt: string;
}

export interface IConfigureKycTemplatePayload {
  name: string;
  description?: string;
  requirements: IKycRequirementDto[];
  isActive?: boolean;
}

interface IApiResponse<T> {
  success?: boolean;
  message: string;
  data: T;
}

/* =========================================================
   UI MODEL
========================================================= */

export interface IKycFieldView {
  id: string;
  label: string;
  description: string;
  documentType: KycDocumentType;
  required: boolean;
  requiresBothSides: boolean;
  allowedMimeTypes: string[];
  maxFileSizeMb: number;
}

export interface IKycTemplateView {
  id: string;
  name: string;
  description: string;
  isActive: boolean;

  /**
   * Backend returns id="" when the default recommendation
   * has not been persisted yet.
   */
  isPersisted: boolean;

  fields: IKycFieldView[];
}

/* =========================================================
   DEFAULTS
========================================================= */

export const DEFAULT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

export const DEFAULT_MAX_FILE_MB = 5;

/* =========================================================
   ERRORS
========================================================= */

export class KycServiceError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "KycServiceError";
    this.status = status;
  }
}

const toServiceError = (error: unknown): KycServiceError => {
  if (error instanceof KycServiceError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return new KycServiceError(message, error.response?.status);
  }

  return new KycServiceError("Something went wrong. Please try again.");
};

/* =========================================================
   MAPPERS
========================================================= */

const toFieldView = (
  requirement: IKycRequirementDto,
): IKycFieldView => ({
  id: requirement.id,
  label: requirement.title,
  description: requirement.description ?? "",
  documentType: requirement.documentType,
  required: requirement.isRequired,
  requiresBothSides: requirement.requiresBothSides,
  allowedMimeTypes: [...requirement.allowedMimeTypes],
  maxFileSizeMb: requirement.maxFileSizeMb,
});

const toTemplateView = (
  dto: ITenantKycTemplateDto,
): IKycTemplateView => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? "",
  isActive: dto.isActive,
  isPersisted: dto.id !== "",
  fields: dto.requirements.map(toFieldView),
});

const toRequirementDto = (
  field: IKycFieldView,
): IKycRequirementDto => ({
  id: field.id,
  documentType: field.documentType,
  title: field.label.trim(),
  description: field.description.trim() || undefined,
  isRequired: field.required,
  requiresBothSides: field.requiresBothSides,
  allowedMimeTypes:
    field.allowedMimeTypes.length > 0
      ? field.allowedMimeTypes
      : [...DEFAULT_MIME_TYPES],
  maxFileSizeMb:
    field.maxFileSizeMb > 0
      ? field.maxFileSizeMb
      : DEFAULT_MAX_FILE_MB,
});

/* =========================================================
   SERVICE
========================================================= */

class TenantKycConfigService {
  /**
   * Get tenant KYC configuration.
   *
   * If the tenant has never configured KYC,
   * backend returns its default recommendation.
   */
  async getTemplate(
    signal?: AbortSignal,
  ): Promise<IKycTemplateView> {
    try {
      const { data } = await api.get<
        IApiResponse<{
          template: ITenantKycTemplateDto;
        }>
      >(
        API_ROUTES.TENANTS.GET_KYC_TEMPLATE,
        { signal },
      );

      return toTemplateView(data.data.template);
    } catch (error) {
      throw toServiceError(error);
    }
  }

  /**
   * Create or update the tenant KYC configuration.
   *
   * Backend uses PUT + upsert, so the frontend does not
   * need separate create/update methods.
   */
  async saveTemplate(
    template: Pick<
      IKycTemplateView,
      "name" | "description" | "isActive"
    >,
    fields: IKycFieldView[],
  ): Promise<IKycTemplateView> {
    if (!template.name.trim()) {
      throw new KycServiceError(
        "KYC template name is required.",
      );
    }

    if (fields.length === 0) {
      throw new KycServiceError(
        "At least one KYC requirement must be configured.",
      );
    }

    if (fields.some((field) => !field.label.trim())) {
      throw new KycServiceError(
        "Every KYC requirement needs a title.",
      );
    }

    if (
      fields.some(
        (field) =>
          !field.documentType ||
          !Object.values(KycDocumentType).includes(
            field.documentType,
          ),
      )
    ) {
      throw new KycServiceError(
        "Every KYC requirement must have a valid document type.",
      );
    }

    if (
      fields.some(
        (field) =>
          !field.allowedMimeTypes ||
          field.allowedMimeTypes.length === 0,
      )
    ) {
      throw new KycServiceError(
        "Every KYC requirement must allow at least one file type.",
      );
    }

    if (
      fields.some(
        (field) =>
          field.maxFileSizeMb < 1 ||
          field.maxFileSizeMb > 20,
      )
    ) {
      throw new KycServiceError(
        "Maximum file size must be between 1 MB and 20 MB.",
      );
    }

    const payload: IConfigureKycTemplatePayload = {
      name: template.name.trim(),
      description:
        template.description.trim() || undefined,
      isActive: template.isActive,
      requirements: fields.map(toRequirementDto),
    };

    try {
      const { data } = await api.put<
        IApiResponse<{
          template: ITenantKycTemplateDto;
        }>
      >(
        API_ROUTES.TENANTS.CONFIG_KYC,
        payload,
      );

      return toTemplateView(data.data.template);
    } catch (error) {
      throw toServiceError(error);
    }
  }
}

export const tenantKycConfigService =
  new TenantKycConfigService();