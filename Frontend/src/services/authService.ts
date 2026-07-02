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
            '/auth/super-admin/login',
            credentials
        )

        return response.data.data
    }

    async registerUser(data: IUserRegisterRequest): Promise<IUserRegisterResponse> {
        const response = await api.post<{data: IUserRegisterResponse}>(
            '/users/register',
            data
        )

        return response.data.data
    }

    async loginUser(credentials: ILoginRequest): Promise<ILoginResponse> {
        const response = await api.post<{data: ILoginResponse}>(
            '/users/login',
            credentials
        )

        return response.data.data
    }

    async verifyUserOtp(data: IVerifyOtpRequest): Promise<IVerifyOtpResponse> {
        const response = await api.post<{data: IVerifyOtpResponse}>(
            '/users/register/verify-otp',
            data
        )

        return response.data.data
    }

    async requestPasswordResetOtp(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
  const response = await api.post<{ data: IForgotPasswordResponse }>(
    '/users/forgot-password/send-otp',
    data
  );

  return response.data.data;
}

async resendPasswordResetOtp(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
  const response = await api.post<{ data: IForgotPasswordResponse }>(
    '/users/forgot-password/resend-otp',
    data
  );

  return response.data.data;
}

async verifyPasswordResetOtp(
  data: IVerifyPasswordResetOtpRequest
): Promise<IVerifyPasswordResetOtpResponse> {
  const response = await api.post<{ data: IVerifyPasswordResetOtpResponse }>(
    '/users/forgot-password/verify-otp',
    data
  );

  return response.data.data;
}

async resetUserPassword(data: IResetPasswordRequest): Promise<IResetPasswordResponse> {
  const response = await api.post<{ data: IResetPasswordResponse }>(
    '/users/forgot-password/reset',
    data
  );

  return response.data.data;
}

    //google login
    async googleLogin(idToken: string): Promise<ILoginResponse> {
        const response = await api.post<{data: ILoginResponse}>(
            '/users/google',
            {idToken}
        )
        return response.data.data
    }

    async resendUserOtp(data: IResendOtpRequest): Promise<IResendOtpResponse> {
        const response = await api.post<{data: IResendOtpResponse}>(
            '/users/register/resend-otp',
            data
        )
        return response.data.data
    }

    async logout(): Promise<void> {
        const isSuperAdminSession = window.location.pathname.startsWith('/superadmin')
        await api.post(isSuperAdminSession ? '/auth/super-admin/logout' : '/auth/user/logout')
        removeAccessToken(isSuperAdminSession ? 'SUPER_ADMIN' : 'USER')
    }
}

export const authService = new AuthService()
