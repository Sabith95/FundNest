import { OnboardingStep } from "../../shared/constants/enums/OnboardingStep";
import { TenantStatus } from "../../shared/constants/enums/TenantStatus";
import { VerificationStatus } from "../../shared/constants/enums/VerificationStatus";
import { BusinessType } from "../../shared/constants/enums/BusinessType";
import { Role } from "../../shared/constants/roles";

export interface VerificationInfo {
  status: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: Date;
}

export interface BusinessInfo {
  businessType: BusinessType;
  registrationId: string;
  registeredBusinessAddress: string;

  verification: VerificationInfo
}

export interface DocumentInfo {
  url: string;
  publicId: string;

  verification: VerificationInfo
}

export interface KycDocuments {
  businessRegistrationCertificate: DocumentInfo;
  ownerIdProof: DocumentInfo;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;

  verification: VerificationInfo;
}

export interface Tenant {
  id: string;

  companyName: string;
  ownerName: string;

  email: string;
  phone: string;
  password: string;

  role: Role;

  isEmailVerified: boolean;
  isActive: boolean;

  status: TenantStatus;
  onboardingStep: OnboardingStep;

  businessInfo?: BusinessInfo;
  kycDocuments?: KycDocuments;
  bankDetails?: BankDetails;

  rejectionReason?: string;

  approvedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}