import { Tenant } from "../../domain/entities/Tenant"
import { AdminTenantResponseDto } from "../../application/admin/dto/AdminTenantResponseDto"

export class AdminTenantResponseDtoMapper {
  static toDto(tenant: Tenant): AdminTenantResponseDto {
    return {
      id: tenant.id,
      companyName: tenant.companyName,
      ownerName: tenant.ownerName,
      email: tenant.email,
      isActive:tenant.isActive,
      verificationStatus: tenant.status,
      createdAt: tenant.createdAt,
    };
  }

  static toDtoList(tenants: Tenant[]): AdminTenantResponseDto[] {
    return tenants.map((tenant) => this.toDto(tenant));
  }
}