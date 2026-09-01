import { API_ROUTES } from "../shared/apiRoutes";
import type { TenantDetailsData } from "../types/tenant.types";
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

interface TenantListResponse {
  tenants: AdminTenant[];
  total: number;
  page: number;
  limit: number;
}

export const adminTenantService = {
  async getTenants(page: number, limit: number, search?: string): Promise<TenantListResponse> {
    const response = await api.get(API_ROUTES.SUPER_ADMIN.GET_TENANTS, {
      params: { page, limit, search: search || undefined },
    });
    return response.data.data;
  },

  async getTenant(id: string): Promise<TenantDetailsData> {
    const response = await api.get(API_ROUTES.SUPER_ADMIN.GET_TENANT(id));
    return response.data.data.tenant;
  },

  async updateStatus(id: string, isActive: boolean): Promise<AdminTenant> {
    const response = await api.patch(API_ROUTES.SUPER_ADMIN.UPDATE_TENANT_STATUS(id), { isActive });
    return response.data.data.tenant;
  },

  async verifyBusinessDetails(id: string, isApproved: boolean, rejectionReason?: string): Promise<TenantDetailsData> {
    const response = await api.patch(API_ROUTES.SUPER_ADMIN.VERIFY_BUSINESS_DETAILS(id), {
      status: isApproved ? "APPROVED" : "REJECTED",
      rejectionReason,
    });
    return response.data.data.tenant;
  },
  async verifyBankDetails(id: string, isApproved: boolean, rejectionReason?: string): Promise<TenantDetailsData> {
    const response = await api.patch(API_ROUTES.SUPER_ADMIN.VERIFY_BANK_DETAILS(id), {
      status: isApproved ? "APPROVED" : "REJECTED",
      rejectionReason,
    });
    return response.data.data.tenant;
  },
  async verifyKycDocuments(
    id: string,
    payload: {
      businessRegistrationStatus: string;
      businessRegistrationRejectionReason?: string;
      ownerIdProofStatus: string;
      ownerIdProofRejectionReason?: string;
    }
  ): Promise<TenantDetailsData> {
    const response = await api.patch(API_ROUTES.SUPER_ADMIN.VERIFY_KYC_DOCUMENTS(id), payload);
    return response.data.data.tenant;
  },

  async completeVerification(id: string): Promise<TenantDetailsData> {
    const response = await api.post(API_ROUTES.SUPER_ADMIN.COMPLETE_TENANT_VERIFICATION(id));
    return response.data.data.tenant;
  },
};