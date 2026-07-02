"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const tsyringe_1 = require("tsyringe");
const env_1 = require("../../config/env");
const logger_1 = require("../../shared/logger");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: env_1.env.SMTP_HOST,
            port: env_1.env.SMTP_PORT,
            secure: env_1.env.SMTP_SECURE,
            auth: {
                user: env_1.env.SMTP_USER,
                pass: env_1.env.SMTP_PASS,
            },
        });
    }
    async sendOtp(email, otp) {
        await this.transporter.sendMail({
            from: `"${env_1.env.SMTP_FROM_NAME}" <${env_1.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: "Verify your FundNest account",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a3a6e;">FundNest Email Verification</h2>
            <p>Your OTP for account verification is:</p>
            <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1a3a6e; margin: 24px 0;">
                ${otp}
            </div>
            <p>This OTP will expire in ${Math.ceil(env_1.env.OTP_EXPIRES_IN_SECONDS / 60)} minute.</p>
            <p>If you did not request this, please ignore this email.</p>
            </div>
        `,
        });
        logger_1.logger.info(`OTP sent to ${email}. OTP:${otp} `);
    }
    async sendPasswordResetOtp(email, otp) {
        await this.transporter.sendMail({
            from: `"${env_1.env.SMTP_FROM_NAME}" <${env_1.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: 'Reset your FundNest password',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a3a6e;">FundNest Password Reset</h2>
            <p>Your password reset OTP is:</p>
            <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1a3a6e; margin: 24px 0;">
            ${otp}
            </div>
            <p>This OTP will expire in ${Math.ceil(env_1.env.OTP_EXPIRES_IN_SECONDS / 60)} minute.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        `,
        });
        logger_1.logger.info(`Password reset OTP sent to ${email}. OTP:${otp}`);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, tsyringe_1.injectable)()
], EmailService);
