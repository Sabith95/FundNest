import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose"

export interface StoreOtpData {
    email: string
    userId: string
    otp: string
    purpose: OtpPurpose
}

export interface VerifyOtpData {
    email: string
    otp: string
    purpose: OtpPurpose
}

export interface VerifiedOtpResult {
  userId: string;
  email: string;
}

export interface IOtpService {
    storeOtp(data: StoreOtpData): Promise<void>
    verifyOtp(data: VerifyOtpData): Promise<VerifiedOtpResult>
    createPasswordResetSession(email: string, userId: string): Promise<void>
    consumePasswordResetSession(email: string): Promise<VerifiedOtpResult>
}
