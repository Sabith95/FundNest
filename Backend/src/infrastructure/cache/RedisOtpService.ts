import crypto from "crypto";
import { injectable } from "tsyringe";
import { env } from "../config/env";
import { redisClient } from "./RedisClient";
import {
  IOtpService,
  StoreOtpData,
  VerifyOtpData,
  VerifiedOtpResult,
  PendingRegistration,
  PendingTenantRegistration,
} from "./interfaces/IOtpService";
import { BadRequestError } from "../../shared/errors/BadRequestError";

interface StoredOtpPayload {
  userId?: string;
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
      env.OTP_EXPIRES_IN_SECONDS,
    );
  }

  async verifyOtp(data: VerifyOtpData): Promise<VerifiedOtpResult> {
    const key = this.getOtpKey(data.purpose, data.email);
    const rawOtp = await redisClient.get(key);

    if (!rawOtp) {
      throw new BadRequestError("OTP Expired or invalid");
    }

    const storedOtp = JSON.parse(rawOtp) as StoredOtpPayload;

    if (storedOtp.attempts >= env.OTP_MAX_ATTEMPTS) {
      await redisClient.del(key);
      throw new BadRequestError("Maximum OTP attempts exceeded");
    }

    const incomingOtpHash = this.hashOtp(data.otp);

    if (incomingOtpHash !== storedOtp.otpHash) {
      storedOtp.attempts += 1;

      const ttl = await redisClient.ttl(key);

      if (ttl > 0) {
        await redisClient.set(key, JSON.stringify(storedOtp), "EX", ttl);
      }

      throw new BadRequestError("Invalid OTP");
    }

    await redisClient.del(key);

    return {
      userId: storedOtp.userId,
      email: storedOtp.email,
    };
  }

  async createPasswordResetSession(
    email: string,
    userId: string,
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
      env.OTP_EXPIRES_IN_SECONDS,
    );
  }

  async consumePasswordResetSession(email: string): Promise<VerifiedOtpResult> {
    const key = this.getPasswordResetSessionKey(email);
    const raw = await redisClient.get(key);

    if (!raw) {
      throw new BadRequestError(
        "Password reset session expired. Please verify OTP again.",
      );
    }

    await redisClient.del(key);

    const session = JSON.parse(raw) as PasswordResetSessionPayload;

    return {
      userId: session.userId,
      email: session.email,
    };
  }

  async storePendingUserRegistration(data: PendingRegistration): Promise<void> {
    const key = this.getPendingRegistrationKey(data.email);

    await redisClient.set(
      key,
      JSON.stringify(data),
      "EX",
      env.OTP_EXPIRES_IN_SECONDS,
    );
  }

  async getPendingUserRegistration(
    email: string,
  ): Promise<PendingRegistration | null> {
    const key = this.getPendingRegistrationKey(email);

    const raw = await redisClient.get(key);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as PendingRegistration;
  }

  async deletePendingUserRegistration(email: string): Promise<void> {
    const key = this.getPendingRegistrationKey(email);

    await redisClient.del(key);
  }

  async storePendingTenantRegistration(
    data: PendingTenantRegistration,
  ): Promise<void> {
    const key = this.getPendingTenantRegistrationKey(data.email);

    await redisClient.set(
      key,
      JSON.stringify(data),
      "EX",
      env.OTP_EXPIRES_IN_SECONDS,
    );
  }

  async getPendingTenantRegistration(
    email: string,
  ): Promise<PendingTenantRegistration | null> {
    const key = this.getPendingTenantRegistrationKey(email);

    const raw = await redisClient.get(key);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as PendingTenantRegistration;
  }

  async deletePendingTenantRegistration(email: string): Promise<void> {
    const key = this.getPendingTenantRegistrationKey(email);

    await redisClient.del(key);
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

  private getPendingRegistrationKey(email: string): string {
    return `pending_registration:user:${email.toLowerCase().trim()}`;
  }

  private getPendingTenantRegistrationKey(email: string): string {
    return `pending_registration:tenant:${email.toLowerCase().trim()}`;
  }
}
