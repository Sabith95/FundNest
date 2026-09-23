import api from "./api";
import { API_ROUTES } from "../shared/apiRoutes";

export type FundType = "NORMAL" | "MULTI_DIVISION";

export interface ChitFund {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  fundType: FundType;
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  currentMembersCount: number;
  startDate: string;
  division: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNormalFundPayload {
  name: string;
  description?: string;
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  startDate: string;
}

export interface CreateMultiDivisionFundPayload extends CreateNormalFundPayload {
  division: number;
}

export const tenantFundService = {
  /**
   * Fetch all chit funds owned by the logged-in tenant.
   */
  async getTenantFunds(): Promise<ChitFund[]> {
    const response = await api.get(API_ROUTES.TENANTS.GET_CHIT_FUNDS);
    return response.data.data.funds || [];
  },

  /**
   * Create a standard (Normal) chit fund.
   */
  async createNormalFund(payload: CreateNormalFundPayload): Promise<ChitFund> {
    const response = await api.post(
      API_ROUTES.TENANTS.CREATE_NORMAL_CHIT_FUND,
      payload,
    );
    return response.data.data.fund;
  },

  /**
   * Create a Multi-Division chit fund.
   */
  async createMultiDivisionFund(
    payload: CreateMultiDivisionFundPayload
  ): Promise<ChitFund> {
    const response = await api.post(
      API_ROUTES.TENANTS.CREATE_MULTI_DIVISION_CHIT_FUND,
      payload,
    );
    return response.data.data.fund;
  },

  /**
   * Block an active chit fund.
   */
  async blockFund(fundId: string): Promise<ChitFund> {
    const response = await api.patch(API_ROUTES.TENANTS.BLOCK_CHIT_FUND(fundId));
    return response.data.data.fund;
  },

  /**
   * Unblock a blocked chit fund.
   */
  async unblockFund(fundId: string): Promise<ChitFund> {
    const response = await api.patch(
      API_ROUTES.TENANTS.UNBLOCK_CHIT_FUND(fundId),
    );
    return response.data.data.fund;
  },
};
