import { z } from "zod";
import { KycDocumentType } from "../../../../shared/constants/enums/KycDocumentType";

const kycRequirementSchema = z.object({
  id: z.string().trim().min(1, "Requirement ID is required"),
  documentType: z.nativeEnum(KycDocumentType, {
    error: "Invalid KYC document type",
  }),
  title: z
    .string()
    .trim()
    .min(2, "Title must have at least 2 characters")
    .max(100),
  description: z.string().trim().max(300).optional(),
  isRequired: z.boolean().default(true),
  requiresBothSides: z.boolean().default(false),
  allowedMimeTypes: z
    .array(z.string())
    .min(1, "At least one allowed mime type is required"),
  maxFileSizeMb: z.number().min(1).max(20).default(5),
});

export const configureTenantKycTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Template name must have at least 2 characters")
    .max(100),
  description: z.string().trim().max(500).optional(),
  requirements: z
    .array(kycRequirementSchema)
    .min(1, "At least one KYC requirement is required"),
  isActive: z.boolean().optional(),
});
