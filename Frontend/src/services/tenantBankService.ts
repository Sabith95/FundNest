import api from "./api";
import type {
  IUpdateBankDetailsRequest,
  IUpdateBankDetailsResponse,
} from "../types/bankingDetails.types";
import { API_ROUTES } from "../shared/apiRoutes";

interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

class TenantBankService {
  async updateBankDetails(
    data: IUpdateBankDetailsRequest,
  ): Promise<IUpdateBankDetailsResponse> {
    const response = await api.post<IApiResponse<IUpdateBankDetailsResponse>>(
      API_ROUTES.TENANTS.UPDATE_BANK_DETAILS,
      data,
    );

    return response.data.data;
  }
}

export const tenantBankService = new TenantBankService();
