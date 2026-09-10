import { VerificationStatus } from "../../../shared/constants/enums/VerificationStatus";

export interface VerifyBusinessDetailsDto {
  status: VerificationStatus;
  rejectionReason?: string;
}

export interface VerifyKycDocumentsDto {
  businessRegistrationStatus: VerificationStatus;
  businessRegistrationRejectionReason?: string;
  ownerIdProofStatus: VerificationStatus;
  ownerIdProofRejectionReason?: string;
}

export interface VerifyBankDetailsDto {
  status: VerificationStatus;
  rejectionReason?: string;
}
