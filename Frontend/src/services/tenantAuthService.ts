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
    ITenantLoginResponse,
    ITenantProfile
} from "../types/tenant.types";
import type { 
    IForgotPasswordRequest,
    IForgotPasswordResponse,
    IVerifyPasswordResetOtpRequest,
    IVerifyPasswordResetOtpResponse,
    IResetPasswordRequest,
    IResetPasswordResponse
 } from "../types/auth.types";
import { API_ROUTES } from "../shared/apiRoutes";

export interface ITenantAuthService {
    registerTenant(data: ITenantRegisterRequest): Promise<ITenantRegisterResponse>
    verifyTenantOtp(data: IVerifyTenantOtpRequest): Promise<IVerifyTenantOtpResponse>
    resendTenantOtp(data: IResendTenantOtpRequest): Promise<IResendTenantOtpResponse>
    updateBusinessInfo(data: IUpdateBusinessInfoRequest): Promise<IUpdateBusinessInfoResponse>
    loginTenant(data: ITenantLoginRequest): Promise<ITenantLoginResponse>
    getTenantProfile(): Promise<ITenantProfile>;
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

    async getTenantProfile(): Promise<ITenantProfile> {
        const response = await api.get<{ data: { tenant: ITenantProfile } }>(API_ROUTES.TENANTS.GET_PROFILE);
        return response.data.data.tenant;
    }

    async requestPasswordResetOtp(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
    const response = await api.post<{ data: IForgotPasswordResponse }>(
        API_ROUTES.TENANTS.REQUEST_PASSWORD_RESET_OTP,
        data
    );

    return response.data.data;
    }

    async resendPasswordResetOtp(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
    const response = await api.post<{ data: IForgotPasswordResponse }>(
        API_ROUTES.TENANTS.RESEND_PASSWORD_RESET_OTP,
        data
    );

    return response.data.data;
    }

    async verifyPasswordResetOtp(
    data: IVerifyPasswordResetOtpRequest
    ): Promise<IVerifyPasswordResetOtpResponse> {
    const response = await api.post<{ data: IVerifyPasswordResetOtpResponse }>(
        API_ROUTES.TENANTS.VERIFY_PASSWORD_RESET_OTP,
        data
    );

    return response.data.data;
    }

    async resetTenantPassword(data: IResetPasswordRequest): Promise<IResetPasswordResponse> {
    const response = await api.post<{ data: IResetPasswordResponse }>(
        API_ROUTES.TENANTS.RESET_PASSWORD,
        data
    );

    return response.data.data;
    }
}


export const tenantAuthService = new TenantAuthService()