import api from "./api";
import type {
    ITenantRegisterRequest,
    ITenantRegisterResponse,
    IVerifyTenantOtpRequest,
    IVerifyTenantOtpResponse,
    IResendTenantOtpRequest,
    IResendTenantOtpResponse
} from "../types/tenant.types";


export interface ITenantAuthService {
    registerTenant(data: ITenantRegisterRequest): Promise<ITenantRegisterResponse>
    verifyTenantOtp(data: IVerifyTenantOtpRequest): Promise<IVerifyTenantOtpResponse>
    resendTenantOtp(data: IResendTenantOtpRequest): Promise<IResendTenantOtpResponse>
}

class TenantAuthService implements ITenantAuthService {
    async registerTenant(data: ITenantRegisterRequest): Promise<ITenantRegisterResponse> {
        const response = await api.post<{ data: ITenantRegisterResponse }>(
            '/tenants/register',
            data
        )
        return response.data.data
    }

    async verifyTenantOtp(data: IVerifyTenantOtpRequest): Promise<IVerifyTenantOtpResponse> {
        const response = await api.post<{ data: IVerifyTenantOtpResponse }>(
            '/tenants/register/verify-otp',
            data
        )

        return response.data.data
    }

    async resendTenantOtp(data: IResendTenantOtpRequest): Promise<IResendTenantOtpResponse> {
        const response = await api.post<{data: IResendTenantOtpResponse}>(
            '/tenants/register/resend-otp',
            data
        )
        return response.data.data
    }
}


export const tenantAuthService = new TenantAuthService()