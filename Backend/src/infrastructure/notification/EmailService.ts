import nodemailer from "nodemailer";
import { IEmailService } from "./interfaces/IEmailService";
import { injectable } from "tsyringe";
import { env } from "../config/env";
import { logger } from "../../shared/logger";

@injectable()
export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  async sendOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Verify your FundNest account",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a3a6e;">FundNest Email Verification</h2>
            <p>Your OTP for account verification is:</p>
            <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1a3a6e; margin: 24px 0;">
                ${otp}
            </div>
            <p>This OTP will expire in ${Math.ceil(env.OTP_EXPIRES_IN_SECONDS / 60)} minute.</p>
            <p>If you did not request this, please ignore this email.</p>
            </div>
        `,
    });
    logger.info(`OTP sent to ${email}. OTP:${otp} `);
  }

  async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Reset your FundNest password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a3a6e;">FundNest Password Reset</h2>
            <p>Your password reset OTP is:</p>
            <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1a3a6e; margin: 24px 0;">
            ${otp}
            </div>
            <p>This OTP will expire in ${Math.ceil(env.OTP_EXPIRES_IN_SECONDS / 60)} minute.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        `,
    });

    logger.info(`Password reset OTP sent to ${email}. OTP:${otp}`);
  }

  async sendTenantVerificationApprovedEmail(
    email: string,
    companyName: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "FundNest - Account Verification Approved",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1a3a6e;">Verification Approved!</h2>
                <p>Hello ${companyName},</p>
                <p>Great news! Your account verification has been completed and <strong>APPROVED</strong> by our administration team.</p>
                <p>You can now log in and access all features of FundNest.</p>
                <br/>
                <p>Best regards,<br/>The FundNest Team</p>
            </div>
        `,
    });
    logger.info(`Tenant verification approval email sent to ${email}`);
  }

  async sendTenantVerificationRejectedEmail(
    email: string,
    companyName: string,
    reason: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "FundNest - Account Verification Status Update",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #d9534f;">Verification Update</h2>
                <p>Hello ${companyName},</p>
                <p>We reviewed your submitted verification documents. Unfortunately, your verification request was <strong>REJECTED</strong>.</p>
                <p><strong>Reason(s):</strong> ${reason}</p>
                <p>Please update your business information / documents accordingly and re-submit for review.</p>
                <br/>
                <p>Best regards,<br/>The FundNest Team</p>
            </div>
        `,
    });
    logger.info(`Tenant verification rejection email sent to ${email}`);
  }
}
