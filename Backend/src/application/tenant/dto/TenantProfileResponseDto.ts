import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

export interface VerificationSectionDto {
  status?: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
}

export interface TenantProfileResponseDto {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: TenantStatus;
  onboardingStep: OnboardingStep;
  rejectionReason?: string;

  businessInfo?: {
    businessType: string;
    registrationId: string;
    registeredBusinessAddress: string;
    verification?: VerificationSectionDto;
  };

  kycDocuments?: {
    businessRegistrationCertificate?: {
      objectKey: string;
      verification?: VerificationSectionDto;
    };
    ownerIdProof?: {
      objectKey: string;
      verification?: VerificationSectionDto;
    };
  };

  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    verification?: VerificationSectionDto;
  };
}
