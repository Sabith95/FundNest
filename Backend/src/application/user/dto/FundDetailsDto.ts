import { ChitFundResponseDto } from "../../tenant/chitfund/dto/ChitFundResponseDto";

export interface FundTenantDetailsDto {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone?: string;
  status: string;
  businessType?: string;
  registrationId?: string;
  registeredBusinessAddress?: string;
  isVerified: boolean;
  memberSince: string;
}

export interface FundDetailsDto {
  fund: ChitFundResponseDto;
  tenant: FundTenantDetailsDto;
  kycRequired: boolean;
  userKycStatus?: string;
  isUserKycVerified: boolean;
}
