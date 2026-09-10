import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";
import { BusinessType } from "../../../shared/constants/enums/BusinessType";

export interface AdminTenantResponseDto {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  isActive: boolean;
  verificationStatus: string;
  createdAt: Date;
}

export interface VerificationItem {
  label: string;
  state: VerificationStatus;
}

export interface TenantSubscriptionDto {
  planName: string;
  priceMonthly: number;
  isActive: boolean;
  nextRenewalDate: string;
}
export interface TenantFinancialsDto {
  bankName: string;
  accountHolder: string;
  accountNumberLast4: string;
}

export interface VerificationInfoDto {
  status: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: Date;
}
export interface BusinessInfoDto {
  businessType?: BusinessType;
  registrationId?: string;
  registeredBusinessAddress?: string;
  verification?: VerificationInfoDto;
}
export interface DocumentInfoDto {
  objectKey: string;
  verification?: VerificationInfoDto;
}
export interface KycDocumentsDto {
  businessRegistrationCertificate?: DocumentInfoDto;
  ownerIdProof?: DocumentInfoDto;
}
export interface BankDetailsDto {
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  verification?: VerificationInfoDto;
}

export interface AdminTenantDetailsResponseDto {
  id: string;
  name: string;
  status: string;
  primaryOwner: string;
  email: string;
  phone: string;
  registrationDate: string;
  verification: VerificationItem[];
  subscription: TenantSubscriptionDto | null;
  financials: TenantFinancialsDto | null;
  businessInfo?: BusinessInfoDto | null;
  kycDocuments?: KycDocumentsDto | null;
  bankDetails?: BankDetailsDto | null;
}
