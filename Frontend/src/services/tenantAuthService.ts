import api from "./api";
import type {
    ITenantRegisterRequest,
    ITenantRegisterResponse,
    IVerifyTenantOtpRequest,
    IVerifyTenantOtpResponse,
    IResendTenantOtpRequest,
    IResendTenantOtpResponse,
    IUpdateBusinessInfoRequest,
    IUpdateBusinessInfoResponse,
    ITenantLoginRequest,
    ITenantLoginResponse
} from "../types/tenant.types";
import { API_ROUTES } from "../shared/apiRoutes";

export interface ITenantAuthService {
    registerTenant(data: ITenantRegisterRequest): Promise<ITenantRegisterResponse>
    verifyTenantOtp(data: IVerifyTenantOtpRequest): Promise<IVerifyTenantOtpResponse>
    resendTenantOtp(data: IResendTenantOtpRequest): Promise<IResendTenantOtpResponse>
    updateBusinessInfo(data: IUpdateBusinessInfoRequest): Promise<IUpdateBusinessInfoResponse>
    loginTenant(data: ITenantLoginRequest): Promise<ITenantLoginResponse>
}

class TenantAuthService implements ITenantAuthService {
    async registerTenant(data: ITenantRegisterRequest): Promise<ITenantRegisterResponse> {
        const response = await api.post<{ data: ITenantRegisterResponse }>(
            API_ROUTES.TENANTS.REGISTER,
            data
        )
        return response.data.data
    }

    async verifyTenantOtp(data: IVerifyTenantOtpRequest): Promise<IVerifyTenantOtpResponse> {
        const response = await api.post<{ data: IVerifyTenantOtpResponse }>(
           API_ROUTES.TENANTS.VERIFY_OTP,
            data
        )

        return response.data.data
    }

    async resendTenantOtp(data: IResendTenantOtpRequest): Promise<IResendTenantOtpResponse> {
        const response = await api.post<{ data: IResendTenantOtpResponse }>(
            API_ROUTES.TENANTS.RESEND_OTP,
            data
        )
        return response.data.data
    }

    async loginTenant(data: ITenantLoginRequest): Promise<ITenantLoginResponse> {
        const response = await api.post<{ data: ITenantLoginResponse }>(API_ROUTES.TENANTS.LOGIN, data)
        return response.data.data
    }
    async updateBusinessInfo(data: IUpdateBusinessInfoRequest): Promise<IUpdateBusinessInfoResponse> {
        const response = await api.post<{ data: IUpdateBusinessInfoResponse }>(
            API_ROUTES.TENANTS.UPDATE_BUSINESS_INFO,
            data
        )
        return response.data.data
    }
}


export const tenantAuthService = new TenantAuthService()