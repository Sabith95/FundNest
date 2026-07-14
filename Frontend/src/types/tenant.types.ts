import type { TenantStatus, OnboardingStep } from "../shared/constants";

export interface ITenant {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;

  isActive: boolean;
  isEmailVerified: boolean;

  status: TenantStatus;
  onboardingStep: OnboardingStep;
}

export interface ITenantRegisterRequest {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ITenantRegisterResponse {
  tenant: ITenant;
}

export interface IVerifyTenantOtpRequest {
  email: string;
  otp: string;
}

export interface IVerifyTenantOtpResponse {
  email: string;
  isEmailVerified: boolean;
  accessToken: string;
}

export interface IResendTenantOtpRequest {
  email: string;
}

export interface IResendTenantOtpResponse {
  email: string;
  otpExpiresInSeconds: number;
}

export interface ITenantLoginRequest {
  email: string;
  password: string;
}

export interface ITenantLoginResponse {
  tenant: ITenant;
  accessToken: string;
}

export interface IUpdateBusinessInfoRequest {
  businessType: string;
  registrationId?: string;
  registeredBusinessAddress: string;
}

export interface IUpdateBusinessInfoResponse {
  tenant: ITenant;
}