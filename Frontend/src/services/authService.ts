import api from './api'
import { removeAccessToken } from './api'
import type { 
    ILoginRequest, 
    ILoginResponse, 
    IUserRegisterRequest, 
    IUserRegisterResponse, 
    IVerifyOtpRequest, 
    IVerifyOtpResponse,
    IResendOtpRequest,
    IResendOtpResponse,
    IForgotPasswordRequest,
    IForgotPasswordResponse,
    IVerifyPasswordResetOtpRequest,
    IVerifyPasswordResetOtpResponse,
    IResetPasswordRequest,
    IResetPasswordResponse,

} from '../types/auth.types'
import { API_ROUTES } from '../shared/apiRoutes'

export interface IAuthService {
    loginSuperAdmin(credentials: ILoginRequest): Promise<ILoginResponse>
    loginUser(credentials: ILoginRequest): Promise<ILoginResponse>
    registerUser(data: IUserRegisterRequest): Promise<IUserRegisterResponse>
    verifyUserOtp(data: IVerifyOtpRequest): Promise<IVerifyOtpResponse>
    logout(): Promise<void>
    googleLogin(idToken: string): Promise<ILoginResponse>
    resendUserOtp(data: IResendOtpRequest): Promise<IResendOtpResponse>;
    requestPasswordResetOtp(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse>;
    resendPasswordResetOtp(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse>;
    verifyPasswordResetOtp(data: IVerifyPasswordResetOtpRequest): Promise<IVerifyPasswordResetOtpResponse>;
    resetUserPassword(data: IResetPasswordRequest): Promise<IResetPasswordResponse>;

}

class AuthService implements IAuthService {
    async loginSuperAdmin(credentials: ILoginRequest): Promise<ILoginResponse> {
        const response = await api.post<{data: ILoginResponse}>(
            API_ROUTES.SUPER_ADMIN.LOGIN,
            credentials
        )

        return response.data.data
    }

    async registerUser(data: IUserRegisterRequest): Promise<IUserRegisterResponse> {
        const response = await api.post<{data: IUserRegisterResponse}>(
            API_ROUTES.USERS.REGISTER,
            data
        )

        return response.data.data
    }

    async loginUser(credentials: ILoginRequest): Promise<ILoginResponse> {
        const response = await api.post<{data: ILoginResponse}>(
            API_ROUTES.USERS.LOGIN,
            credentials
        )

        return response.data.data
    }

    async verifyUserOtp(data: IVerifyOtpRequest): Promise<IVerifyOtpResponse> {
        const response = await api.post<{data: IVerifyOtpResponse}>(
            API_ROUTES.USERS.VERIFY_OTP,
            data
        )

        return response.data.data
    }

    async requestPasswordResetOtp(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
  const response = await api.post<{ data: IForgotPasswordResponse }>(
    API_ROUTES.USERS.REQUEST_PASSWORD_RESET_OTP,
    data
  );

  return response.data.data;
}

async resendPasswordResetOtp(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
  const response = await api.post<{ data: IForgotPasswordResponse }>(
    API_ROUTES.USERS.RESEND_PASSWORD_RESET_OTP,
    data
  );

  return response.data.data;
}

async verifyPasswordResetOtp(
  data: IVerifyPasswordResetOtpRequest
): Promise<IVerifyPasswordResetOtpResponse> {
  const response = await api.post<{ data: IVerifyPasswordResetOtpResponse }>(
    API_ROUTES.USERS.VERIFY_PASSWORD_RESET_OTP,
    data
  );

  return response.data.data;
}

async resetUserPassword(data: IResetPasswordRequest): Promise<IResetPasswordResponse> {
  const response = await api.post<{ data: IResetPasswordResponse }>(
    API_ROUTES.USERS.RESET_PASSWORD,
    data
  );

  return response.data.data;
}

    //google login
    async googleLogin(idToken: string): Promise<ILoginResponse> {
        const response = await api.post<{data: ILoginResponse}>(
            API_ROUTES.USERS.GOOGLE_LOGIN,
            {idToken}
        )
        return response.data.data
    }

    async resendUserOtp(data: IResendOtpRequest): Promise<IResendOtpResponse> {
        const response = await api.post<{data: IResendOtpResponse}>(
            API_ROUTES.USERS.RESEND_OTP,
            data
        )
        return response.data.data
    }

    async logout(): Promise<void> {
        const isSuperAdminSession = window.location.pathname.startsWith('/superadmin')
        await api.post(isSuperAdminSession ? API_ROUTES.SUPER_ADMIN.LOGOUT : API_ROUTES.USERS.LOGOUT)
        removeAccessToken(isSuperAdminSession ? 'SUPER_ADMIN' : 'USER')
    }
}

export const authService = new AuthService()
