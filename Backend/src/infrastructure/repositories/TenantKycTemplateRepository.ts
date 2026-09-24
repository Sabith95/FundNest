import { injectable } from "tsyringe";
import { TenantKycTemplate } from "../../domain/entities/TenantKycTemplate";
import { ITenantKycTemplateRepository } from "../../domain/repositories/ITenantKycTemplateRepository";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { TenantKycTemplateModel } from "../database/models/TenantKycTemplateModel";
import {
  TenantKycTemplatePersistenceMapper,
  TenantKycTemplateRecord,
} from "../database/mapper/TenantKycTemplatePersistenceMapper";

@injectable()
export class TenantKycTemplateRepository
  extends MongoBaseRepository<TenantKycTemplate>
  implements ITenantKycTemplateRepository
{
  constructor() {
    super(TenantKycTemplateModel);
  }

  async findByTenantId(tenantId: string): Promise<TenantKycTemplate | null> {
    const doc = await this.model
      .findOne({ tenantId })
      .lean<TenantKycTemplateRecord>();

    return doc ? this.toEntity(doc) : null;
  }

  async saveTemplate(template: TenantKycTemplate): Promise<TenantKycTemplate> {
    const doc = await this.model
      .findOneAndUpdate(
        { tenantId: template.tenantId },
        {
          tenantId: template.tenantId,
          name: template.name,
          description: template.description,
          requirements: template.requirements,
          isActive: template.isActive,
          updatedAt: new Date(),
        },
        { upsert: true, new: true, runValidators: true },
      )
      .lean<TenantKycTemplateRecord>();

    return this.toEntity(doc!);
  }

  protected toEntity(doc: TenantKycTemplateRecord): TenantKycTemplate {
    return TenantKycTemplatePersistenceMapper.toEntity(doc);
  }
}
