import { Tenant } from "../../../domain/entities/Tenant";

export interface IGetTenantByIdUseCase {
  execute(id: string): Promise<Tenant>;
}