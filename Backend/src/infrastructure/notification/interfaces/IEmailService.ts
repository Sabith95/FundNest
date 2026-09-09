export interface IEmailService {
    sendOtp(email: string, otp: string): Promise<void>
    sendPasswordResetOtp(email: string, otp: string): Promise<void>
    sendTenantVerificationApprovedEmail(email: string, companyName: string): Promise<void>;
    sendTenantVerificationRejectedEmail(email: string, companyName: string, reason: string): Promise<void>;
}