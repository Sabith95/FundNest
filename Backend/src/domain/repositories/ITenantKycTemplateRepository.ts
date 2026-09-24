import { TenantKycTemplate } from "../entities/TenantKycTemplate";
import { IBaseRepository } from "./IBaseRepository";

export interface ITenantKycTemplateRepository extends IBaseRepository<TenantKycTemplate> {
  findByTenantId(tenantId: string): Promise<TenantKycTemplate | null>;
  saveTemplate(template: TenantKycTemplate): Promise<TenantKycTemplate>;
}
