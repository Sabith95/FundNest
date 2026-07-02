import crypto from "crypto";
import { injectable } from "tsyringe";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";
import { HTTP_STATUS } from "../../shared/constants";
import { redisClient } from "./RedisClient";
import {
  IOtpService,
  StoreOtpData,
  VerifyOtpData,
  VerifiedOtpResult,
} from "./interfaces/IOtpService";

interface StoredOtpPayload {
  userId: string;
  email: string;
  otpHash: string;
  attempts: number;
}

interface PasswordResetSessionPayload {
  userId: string;
  email: string;
}

@injectable()
export class RedisOtpService implements IOtpService {
  async storeOtp(data: StoreOtpData): Promise<void> {
    const key = this.getOtpKey(data.purpose, data.email);

    const payload: StoredOtpPayload = {
      userId: data.userId,
      email: data.email,
      otpHash: this.hashOtp(data.otp),
      attempts: 0,
    };

    await redisClient.set(
      key,
      JSON.stringify(payload),
      "EX",
      env.OTP_EXPIRES_IN_SECONDS
    );
  }

  async verifyOtp(data: VerifyOtpData): Promise<VerifiedOtpResult> {
    const key = this.getOtpKey(data.purpose, data.email);
    const rawOtp = await redisClient.get(key);

    if (!rawOtp) {
      throw new AppError("OTP Expired or invalid", HTTP_STATUS.BAD_REQUEST);
    }

    const storedOtp = JSON.parse(rawOtp) as StoredOtpPayload;

    if (storedOtp.attempts >= env.OTP_MAX_ATTEMPTS) {
      await redisClient.del(key);
      throw new AppError(
        "Maximum OTP attempts exceeded",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const incomingOtpHash = this.hashOtp(data.otp);

    if (incomingOtpHash !== storedOtp.otpHash) {
      storedOtp.attempts += 1;

      const ttl = await redisClient.ttl(key);

      if (ttl > 0) {
        await redisClient.set(key, JSON.stringify(storedOtp), "EX", ttl);
      }

      throw new AppError("Invalid OTP", HTTP_STATUS.BAD_REQUEST);
    }

    await redisClient.del(key);

    return {
      userId: storedOtp.userId,
      email: storedOtp.email,
    };
  }

  async createPasswordResetSession(
    email: string,
    userId: string
  ): Promise<void> {
    const key = this.getPasswordResetSessionKey(email);
    const payload: PasswordResetSessionPayload = {
      userId,
      email: email.toLowerCase().trim(),
    };

    await redisClient.set(
      key,
      JSON.stringify(payload),
      "EX",
      env.OTP_EXPIRES_IN_SECONDS
    );
  }

  async consumePasswordResetSession(
    email: string
  ): Promise<VerifiedOtpResult> {
    const key = this.getPasswordResetSessionKey(email);
    const raw = await redisClient.get(key);

    if (!raw) {
      throw new AppError(
        "Password reset session expired. Please verify OTP again.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await redisClient.del(key);

    const session = JSON.parse(raw) as PasswordResetSessionPayload;

    return {
      userId: session.userId,
      email: session.email,
    };
  }

  private getOtpKey(purpose: string, email: string): string {
    return `otp:${purpose}:${email.toLowerCase().trim()}`;
  }

  private getPasswordResetSessionKey(email: string): string {
    return `password_reset_session:${email.toLowerCase().trim()}`;
  }

  private hashOtp(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
  }
}
