import { TenantInvoiceResponseDto } from "../../tenant/dto/TenantInvoiceDto";

export interface IGetTenantInvoicesUseCase {
  execute(tenantId: string): Promise<TenantInvoiceResponseDto[]>;
}
