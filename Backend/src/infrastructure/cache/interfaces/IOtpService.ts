import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { Role } from "../../../shared/constants/roles";

export interface StoreOtpData {
  email: string;
  userId?: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface VerifiedOtpResult {
  userId?: string;
  email: string;
}

export interface PendingRegistration {
  name: string;
  email: string;
  phone?: string;
  password: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  role: Role;
  authProvider: "LOCAL" | "GOOGLE";
}

export interface PendingTenantRegistration {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

export interface IOtpService {
  storeOtp(data: StoreOtpData): Promise<void>;
  verifyOtp(data: VerifyOtpData): Promise<VerifiedOtpResult>;
  createPasswordResetSession(email: string, userId: string): Promise<void>;
  consumePasswordResetSession(email: string): Promise<VerifiedOtpResult>;
  storePendingUserRegistration(data: PendingRegistration): Promise<void>;
  getPendingUserRegistration(
    email: string,
  ): Promise<PendingRegistration | null>;
  deletePendingUserRegistration(email: string): Promise<void>;
  storePendingTenantRegistration(
    data: PendingTenantRegistration,
  ): Promise<void>;

  getPendingTenantRegistration(
    email: string,
  ): Promise<PendingTenantRegistration | null>;

  deletePendingTenantRegistration(email: string): Promise<void>;
}
