import { AdminTenantResponseDto } from "../../admin/dto/AdminTenantResponseDto"
import { GetAllTenantsRequestDto } from "../../admin/dto/GetAllTenantRequestDto";

export interface IGetAllTenantsUseCase {
  execute(
    data: GetAllTenantsRequestDto
  ): Promise<{
    tenants: AdminTenantResponseDto[];
    total: number;
    page: number;
    limit: number;
  }>;
}