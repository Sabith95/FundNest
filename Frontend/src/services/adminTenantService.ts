import api from "./api";

export interface AdminTenant {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  isActive: boolean;
  verificationStatus: string;
  createdAt: string;
}

interface TenantListResponse { tenants: AdminTenant[]; total: number; page: number; limit: number; }

export const adminTenantService = {
  async getTenants(page: number, limit: number): Promise<TenantListResponse> {
    const response = await api.get("/admin/tenants", { params: { page, limit } });
    return response.data.data;
  },
  async getTenant(id: string): Promise<AdminTenant> {
    const response = await api.get(`/admin/tenants/${id}`);
    return response.data.data.tenant;
  },
  async updateStatus(id: string, isActive: boolean): Promise<AdminTenant> {
    const response = await api.patch(`/admin/tenants/${id}/status`, { isActive });
    return response.data.data.tenant;
  },
};
