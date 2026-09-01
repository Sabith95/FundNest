import { Tenant } from "../../../domain/entities/Tenant";

export interface ICompleteTenantVerificationUseCase {
  execute(tenantId: string): Promise<Tenant>;
}