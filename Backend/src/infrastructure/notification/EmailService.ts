import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/interface/notification/IEmailService";
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

  async sendFundJoinKycApprovedEmail(
    email: string,
    userName: string,
    fundName: string,
    contributionAmount: number,
    fundId: string,
  ): Promise<void> {
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(contributionAmount);

    await this.transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `FundNest - KYC Approved for Chit Fund: ${fundName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0d9488; margin-top: 0;">KYC Verification Approved!</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Great news! The organizer has reviewed and <strong>APPROVED</strong> your KYC documentation for joining the chit fund:</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #166534;">${fundName}</p>
            <p style="margin: 0; color: #15803d; font-size: 14px;">Initial Contribution Amount: <strong>${formattedAmount}</strong></p>
          </div>
          <p>You can now log in to FundNest and complete the initial payment to confirm your seat in the fund.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${env.CORS_ORIGIN}/funds/${fundId}" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Complete Payment & Join
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">If you have any questions, please reach out to the fund organizer or FundNest support.</p>
          <p>Best regards,<br/>The FundNest Team</p>
        </div>
      `,
    });
    logger.info(`Fund join KYC approval email sent to ${email} for fund ${fundName}`);
  }

  async sendFundJoinKycRejectedEmail(
    email: string,
    userName: string,
    fundName: string,
    reason: string,
    fundId: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `FundNest - Action Required: KYC Verification for ${fundName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #e11d48; margin-top: 0;">KYC Verification Update</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>The organizer reviewed your KYC documents for joining <strong>${fundName}</strong> and found items requiring correction.</p>
          <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #9f1239;">Reason for Rejection:</p>
            <p style="margin: 0; color: #be123c; font-size: 14px; line-height: 1.5;">${reason}</p>
          </div>
          <p>Please review the feedback and re-upload the required document(s) so your application can be re-evaluated.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${env.CORS_ORIGIN}/funds/${fundId}/kyc" style="background-color: #e11d48; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Re-upload KYC Documents
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Need help? Reply to this email or visit your FundNest dashboard.</p>
          <p>Best regards,<br/>The FundNest Team</p>
        </div>
      `,
    });
    logger.info(`Fund join KYC rejection email sent to ${email} for fund ${fundName}`);
  }
}

