import { Tenant } from "../../../domain/entities/Tenant";

export interface IUpdateTenantStatusUseCase {
  execute(data: { tenantId: string; isActive: boolean }): Promise<Tenant>;
}
