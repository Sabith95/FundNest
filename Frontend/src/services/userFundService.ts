import api from "./api";
import { API_ROUTES } from "../shared/apiRoutes";
import type { IFund, FundIcon } from "../types/fund.types";

export interface ApiChitFund {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  highlights?: string[];
  fundType: "NORMAL" | "MULTI_DIVISION";
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  currentMembersCount: number;
  startDate: string;
  division: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFundTenantDetails {
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

export interface IFundFullDetailsResponse {
  fund: ApiChitFund;
  tenant: IFundTenantDetails;
  kycRequired: boolean;
  userKycStatus?: string;
  isUserKycVerified: boolean;
}

/**
 * Assigns an icon based on fund type and pool value
 */
function resolveFundIcon(type: "NORMAL" | "MULTI_DIVISION", totalPool: number): FundIcon {
  if (type === "MULTI_DIVISION") return "bolt";
  if (totalPool >= 100000) return "diamond";
  if (totalPool >= 50000) return "star";
  return "leaf";
}

/**
 * Maps raw backend API data to the frontend IFund interface
 */
export function mapApiFundToIFund(fund: ApiChitFund): IFund {
  const isMulti = fund.fundType === "MULTI_DIVISION";
  const slotsLeft = Math.max(0, fund.totalMembers - (fund.currentMembersCount ?? 0));
  const divisionCount = fund.division ?? (isMulti ? 3 : 1);

  return {
    id: fund.id,
    name: fund.name,
    tenant: `Organizer #${fund.tenantId.slice(-4).toUpperCase()}`,
    type: isMulti ? "multi" : "normal",
    icon: resolveFundIcon(fund.fundType, fund.chitValue),
    totalPool: fund.chitValue,
    monthly: fund.contributionAmount,
    durationMonths: fund.durationMonths,
    totalSlots: fund.totalMembers,
    slotsLeft,
    auctionsPerMonth: isMulti ? divisionCount : 1,
    winnersPerCycle: isMulti ? divisionCount : 1,
    featured: slotsLeft <= 5 || fund.chitValue >= 100000,
  };
}

export interface IKycRequirementItem {
  id: string;
  documentType: string;
  title: string;
  description?: string;
  isRequired: boolean;
  requiresBothSides: boolean;
  allowedMimeTypes: string[];
  maxFileSizeMb: number;
}

export interface IKycRequirementsResponse {
  fundId: string;
  requiresKyc: boolean;
  template?: {
    id: string;
    name: string;
    description?: string;
    requirements: IKycRequirementItem[];
  };
}

export interface ISubmittedKycDoc {
  requirementId: string;
  documentType: string;
  title: string;
  frontSideKey: string;
  backSideKey?: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
  rejectionReason?: string;
}

export interface IFundJoinStatusResponse {
  fundId: string;
  hasRequest: boolean;
  status: "PENDING_VERIFICATION" | "REJECTED" | "APPROVED" | "PAYMENT_PENDING" | "COMPLETED" | "CANCELLED" | "NONE";
  rejectionReason?: string;
  documents: ISubmittedKycDoc[];
  canPayInitialAmount: boolean;
  isEnrolled: boolean;
  slotNumber?: number;
  initialAmountPaise?: number;
  request?: any;
}

export interface ICreateFundJoinCheckoutResponse {
  checkoutId: string;
  fundId: string;
  fundName: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface IVerifyFundJoinCheckoutInput {
  fundId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const userFundService = {
  /**
   * Fetch all open & active chit funds available for users to join.
   */
  async getAvailableFunds(): Promise<IFund[]> {
    const response = await api.get(API_ROUTES.USERS.GET_AVAILABLE_CHIT_FUNDS);
    const rawFunds: ApiChitFund[] = response.data?.data?.funds ?? [];
    return rawFunds.map(mapApiFundToIFund);
  },

  /**
   * Fetch full fund details along with tenant & organizer profile and KYC status.
   */
  async getFundDetails(id: string): Promise<IFundFullDetailsResponse> {
    const response = await api.get(API_ROUTES.USERS.GET_CHIT_FUND_DETAILS(id));
    return response.data?.data;
  },

  /**
   * Fetch KYC requirements configured by the tenant for this specific fund.
   */
  async getKycRequirements(fundId: string): Promise<IKycRequirementsResponse> {
    const response = await api.get(API_ROUTES.USERS.GET_KYC_REQUIREMENTS(fundId));
    return response.data?.data;
  },

  /**
   * Get the current user's join request & verification status for this fund.
   */
  async getJoinStatus(fundId: string): Promise<IFundJoinStatusResponse> {
    const response = await api.get(API_ROUTES.USERS.GET_JOIN_STATUS(fundId));
    return response.data?.data;
  },

  /**
   * Upload a file directly to AWS S3 using a presigned PUT URL.
   */
  async uploadFileToS3(file: File): Promise<string> {
    const presignedRes = await api.post(API_ROUTES.STORAGE.PRESIGNED_URL, {
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
    });

    const { uploadUrl, objectKey } = presignedRes.data.data;

    // Direct PUT to AWS S3 without default application authorization headers
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload ${file.name} to S3`);
    }

    return objectKey;
  },

  /**
   * Submit KYC documents and create a join request.
   */
  async submitJoinRequest(
    fundId: string,
    documents: Array<{
      requirementId: string;
      documentType: string;
      title: string;
      frontSideKey: string;
      backSideKey?: string;
    }>,
  ): Promise<any> {
    const response = await api.post(
      API_ROUTES.USERS.SUBMIT_JOIN_REQUEST(fundId),
      { documents },
    );
    return response.data?.data;
  },

  /**
   * Re-upload rejected KYC documents.
   */
  async reuploadKyc(
    fundId: string,
    documents: Array<{
      requirementId: string;
      documentType: string;
      title: string;
      frontSideKey: string;
      backSideKey?: string;
    }>,
  ): Promise<any> {
    const response = await api.post(
      API_ROUTES.USERS.REUPLOAD_KYC(fundId),
      { documents },
    );
    return response.data?.data;
  },

  /**
   * Create Razorpay checkout session for the fund initial deposit.
   */
  async createJoinCheckout(
    fundId: string,
  ): Promise<ICreateFundJoinCheckoutResponse> {
    const response = await api.post(
      API_ROUTES.USERS.CREATE_JOIN_CHECKOUT(fundId),
    );
    return response.data?.data;
  },

  /**
   * Verify Razorpay payment signature & activate membership.
   */
  async verifyJoinCheckout(
    input: IVerifyFundJoinCheckoutInput,
  ): Promise<any> {
    const response = await api.post(
      API_ROUTES.USERS.VERIFY_JOIN_CHECKOUT,
      input,
    );
    return response.data?.data;
  },
};