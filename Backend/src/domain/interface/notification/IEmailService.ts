// export interface IEmailService {
//   sendOtp(email: string, otp: string): Promise<void>;
//   sendPasswordResetOtp(email: string, otp: string): Promise<void>;
//   sendTenantVerificationApprovedEmail(
//     email: string,
//     companyName: string,
//   ): Promise<void>;
//   sendTenantVerificationRejectedEmail(
//     email: string,
//     companyName: string,
//     reason: string,
//   ): Promise<void>;
// }

export interface IOtpEmailService {
  sendOtp(email: string, otp: string): Promise<void>;
  sendPasswordResetOtp(email: string, otp: string): Promise<void>;
}

export interface ITenantVerificationEmailService {
  sendTenantVerificationApprovedEmail(
    email: string,
    companyName: string,
  ): Promise<void>;
  sendTenantVerificationRejectedEmail(
    email: string,
    companyName: string,
    reason: string,
  ): Promise<void>;
}

export interface IEmailService
  extends IOtpEmailService, ITenantVerificationEmailService {}
