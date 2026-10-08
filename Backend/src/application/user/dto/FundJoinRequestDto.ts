import {
  DocumentVerificationStatus,
  FundJoinStatus,
} from "../../../domain/entities/FundJoinRequest";

export interface SubmittedKycDocumentInputDto {
  requirementId: string;
  documentType: string;
  title: string;
  frontSideKey: string;
  backSideKey?: string;
}

export interface SubmitFundJoinRequestInputDto {
  documents: SubmittedKycDocumentInputDto[];
}

export interface ReuploadFundKycInputDto {
  documents: SubmittedKycDocumentInputDto[];
}

export interface SubmittedKycDocumentResponseDto {
  requirementId: string;
  documentType: string;
  title: string;
  frontSideKey: string;
  backSideKey?: string;
  status: DocumentVerificationStatus;
  rejectionReason?: string;
}

export interface FundJoinRequestResponseDto {
  id: string;
  fundId: string;
  tenantId: string;
  userId: string;
  documents: SubmittedKycDocumentResponseDto[];
  status: FundJoinStatus;
  rejectionReason?: string;
  slotNumber?: number;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundJoinStatusResponseDto {
  fundId: string;
  hasRequest: boolean;
  status: FundJoinStatus | "NONE";
  rejectionReason?: string;
  documents: SubmittedKycDocumentResponseDto[];
  canPayInitialAmount: boolean;
  isEnrolled: boolean;
  slotNumber?: number;
  initialAmountPaise?: number;
  request?: FundJoinRequestResponseDto;
}

export interface CreateFundJoinCheckoutResponseDto {
  checkoutId: string;
  fundId: string;
  fundName: string;
  amount: number; // in paise
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface VerifyFundJoinCheckoutInputDto {
  fundId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyFundJoinCheckoutResponseDto {
  success: boolean;
  message: string;
  slotNumber: number;
  membershipId: string;
  fundId: string;
}
