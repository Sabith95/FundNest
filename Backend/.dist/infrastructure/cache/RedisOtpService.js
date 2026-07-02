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
exports.RedisOtpService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const tsyringe_1 = require("tsyringe");
const env_1 = require("../../config/env");
const AppError_1 = require("../../shared/errors/AppError");
const constants_1 = require("../../shared/constants");
const RedisClient_1 = require("./RedisClient");
let RedisOtpService = class RedisOtpService {
    async storeOtp(data) {
        const key = this.getOtpKey(data.purpose, data.email);
        const payload = {
            userId: data.userId,
            email: data.email,
            otpHash: this.hashOtp(data.otp),
            attempts: 0,
        };
        await RedisClient_1.redisClient.set(key, JSON.stringify(payload), "EX", env_1.env.OTP_EXPIRES_IN_SECONDS);
    }
    async verifyOtp(data) {
        const key = this.getOtpKey(data.purpose, data.email);
        const rawOtp = await RedisClient_1.redisClient.get(key);
        if (!rawOtp) {
            throw new AppError_1.AppError("OTP Expired or invalid", constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        const storedOtp = JSON.parse(rawOtp);
        if (storedOtp.attempts >= env_1.env.OTP_MAX_ATTEMPTS) {
            await RedisClient_1.redisClient.del(key);
            throw new AppError_1.AppError("Maximum OTP attempts exceeded", constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        const incomingOtpHash = this.hashOtp(data.otp);
        if (incomingOtpHash !== storedOtp.otpHash) {
            storedOtp.attempts += 1;
            const ttl = await RedisClient_1.redisClient.ttl(key);
            if (ttl > 0) {
                await RedisClient_1.redisClient.set(key, JSON.stringify(storedOtp), "EX", ttl);
            }
            throw new AppError_1.AppError("Invalid OTP", constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        await RedisClient_1.redisClient.del(key);
        return {
            userId: storedOtp.userId,
            email: storedOtp.email,
        };
    }
    async createPasswordResetSession(email, userId) {
        const key = this.getPasswordResetSessionKey(email);
        const payload = {
            userId,
            email: email.toLowerCase().trim(),
        };
        await RedisClient_1.redisClient.set(key, JSON.stringify(payload), "EX", env_1.env.OTP_EXPIRES_IN_SECONDS);
    }
    async consumePasswordResetSession(email) {
        const key = this.getPasswordResetSessionKey(email);
        const raw = await RedisClient_1.redisClient.get(key);
        if (!raw) {
            throw new AppError_1.AppError("Password reset session expired. Please verify OTP again.", constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        await RedisClient_1.redisClient.del(key);
        const session = JSON.parse(raw);
        return {
            userId: session.userId,
            email: session.email,
        };
    }
    getOtpKey(purpose, email) {
        return `otp:${purpose}:${email.toLowerCase().trim()}`;
    }
    getPasswordResetSessionKey(email) {
        return `password_reset_session:${email.toLowerCase().trim()}`;
    }
    hashOtp(otp) {
        return crypto_1.default.createHash("sha256").update(otp).digest("hex");
    }
};
exports.RedisOtpService = RedisOtpService;
exports.RedisOtpService = RedisOtpService = __decorate([
    (0, tsyringe_1.injectable)()
], RedisOtpService);
