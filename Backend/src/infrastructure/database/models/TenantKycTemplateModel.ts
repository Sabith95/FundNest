import { HydratedDocument, model, models, Schema, Types } from "mongoose";
import { KycDocumentType } from "../../../shared/constants/enums/KycDocumentType";

export interface KycRequirementSubdocument {
  id: string;
  documentType: KycDocumentType;
  title: string;
  description?: string;
  isRequired: boolean;
  requiresBothSides: boolean;
  allowedMimeTypes: string[];
  maxFileSizeMb: number;
}

export interface TenantKycTemplateDocument {
  tenantId: Types.ObjectId | string;
  name: string;
  description?: string;
  requirements: KycRequirementSubdocument[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const kycRequirementSchema = new Schema<KycRequirementSubdocument>(
  {
    id: { type: String, required: true },
    documentType: {
      type: String,
      enum: Object.values(KycDocumentType),
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isRequired: { type: Boolean, default: true },
    requiresBothSides: { type: Boolean, default: false },
    allowedMimeTypes: {
      type: [String],
      default: ["image/jpeg", "image/png", "application/pdf"],
    },
    maxFileSizeMb: { type: Number, default: 5 },
  },
  { _id: false },
);

const tenantKycTemplateSchema = new Schema<TenantKycTemplateDocument>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Default Member KYC Configuration",
    },
    description: {
      type: String,
      trim: true,
    },
    requirements: {
      type: [kycRequirementSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "tenantKycTemplates",
  },
);

export type HydratedTenantKycTemplateDocument =
  HydratedDocument<TenantKycTemplateDocument>;

export const TenantKycTemplateModel =
  models.TenantKycTemplate ||
  model<TenantKycTemplateDocument>(
    "TenantKycTemplate",
    tenantKycTemplateSchema,
  );
