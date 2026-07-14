import api from "./api";
import type {
    IUpdateBankDetailsRequest,
    IUpdateBankDetailsResponse,
} from "../types/bankingDetails.types";

interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

class TenantBankService {
    async updateBankDetails(
        data: IUpdateBankDetailsRequest
    ): Promise<IUpdateBankDetailsResponse> {
        const response = await api.post<IApiResponse<IUpdateBankDetailsResponse>>(
            "/tenants/bank-details",
            data
        );

        return response.data.data;
    }
}

export const tenantBankService = new TenantBankService();