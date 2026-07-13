import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";

export interface TenantDto {
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

export interface RegisterTenantDto {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string
}

export interface RegisterTenantResponseDto {
  tenant: TenantDto;
}