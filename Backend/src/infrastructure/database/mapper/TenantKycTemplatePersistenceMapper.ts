import { Types } from "mongoose";
import { TenantKycTemplate } from "../../../domain/entities/TenantKycTemplate";
import { TenantKycTemplateDocument } from "../models/TenantKycTemplateModel";

export type TenantKycTemplateRecord = TenantKycTemplateDocument & {
  _id: Types.ObjectId;
};

export class TenantKycTemplatePersistenceMapper {
  static toEntity(record: TenantKycTemplateRecord): TenantKycTemplate {
    return TenantKycTemplate.create({
      id: record._id.toString(),
      tenantId: record.tenantId.toString(),
      name: record.name,
      description: record.description,
      requirements: (record.requirements || []).map((req) => ({
        id: req.id,
        documentType: req.documentType,
        title: req.title,
        description: req.description,
        isRequired: req.isRequired,
        requiresBothSides: req.requiresBothSides,
        allowedMimeTypes: req.allowedMimeTypes,
        maxFileSizeMb: req.maxFileSizeMb,
      })),
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
