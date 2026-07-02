// Role types
export type Role = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER'

// User
export interface IUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    tenantId?: string;
    isActive: boolean;
    createdAt: string;
    isEmailVerified?: boolean
}

// Auth DTOs
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}

// Auth state
export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Form
export interface ILoginFormValues {
  email: string;
  password: string;
}

export interface ILoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface IUserRegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface IUserRegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: Role;
    isActive: boolean;
    isEmailVerified: boolean;
  };
  verificationRequired: boolean;
}

export interface IVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface IVerifyOtpResponse {
  email: string;
  isEmailVerified: boolean;
}

export interface IResendOtpRequest {
  email: string;
}

export interface IResendOtpResponse {
  email: string;
  otpExpiresInSeconds: number;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IForgotPasswordResponse {
  email: string;
  otpExpiresInSeconds: number;
}

export interface IVerifyPasswordResetOtpRequest {
  email: string;
  otp: string;
}

export interface IVerifyPasswordResetOtpResponse {
  email: string;
  verified: boolean;
}

export interface IResetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IResetPasswordResponse {
  email: string;
  passwordReset: boolean;
}
