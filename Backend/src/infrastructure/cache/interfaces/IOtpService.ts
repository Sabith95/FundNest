export type otpPurpose = "USER_REGISTRATION" | "PASSWORD_RESET"

export interface StoreOtpData {
    email: string
    userId: string
    otp: string
    purpose: otpPurpose
}

export interface VerifyOtpData {
    email: string
    otp: string
    purpose: otpPurpose
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
