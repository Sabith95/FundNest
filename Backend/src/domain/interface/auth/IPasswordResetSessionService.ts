import { VerifiedOtpResult } from "../otp/IOtpService";

export interface IPasswordResetSessionService {
  createPasswordResetSession(email: string, userId: string): Promise<void>;
  consumePasswordResetSession(email: string): Promise<VerifiedOtpResult>;
}
