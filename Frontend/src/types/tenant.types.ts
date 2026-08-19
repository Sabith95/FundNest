import type { TenantStatus, OnboardingStep } from "../shared/constants";
import type { ComponentType, SVGProps } from "react";


export interface ITenantProfile {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  status: TenantStatus;
  onboardingStep: OnboardingStep;
}
export interface ITenantState {
  tenant: ITenantProfile | null;
}

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
  verificationRequired: boolean
  email:string
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
  tenant: Pick<ITenant, "id" | "companyName" | "ownerName" | "email" | "status" | "onboardingStep">;
  accessToken: string;
}

export interface IUpdateBusinessInfoRequest {
  businessType: string;
  registrationId?: string;
  registeredBusinessAddress: string;
}

export interface IUpdateBusinessInfoResponse {
  tenant: { id: string; onboardingStep: OnboardingStep };
}

export type TenantVerificationStatus = "pending" | "active" | "rejected";
 
export interface TenantUser {
  name: string;
  role: string;
  avatarUrl?: string;
  verificationStatus: TenantVerificationStatus;
  submittedAt?: string; // ISO date string - when KYC/docs were submitted
}
 
export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}