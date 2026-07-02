"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordResetOtpUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../shared/tokens");
const generateOtp_1 = require("../../../shared/utils/generateOtp");
const env_1 = require("../../../config/env");
let RequestPasswordResetOtpUseCase = class RequestPasswordResetOtpUseCase {
    constructor(userRepository, emailService, otpService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.otpService = otpService;
    }
    async execute(input) {
        const normalizedEmail = input.email.toLowerCase().trim();
        const user = await this.userRepository.findByEmail(normalizedEmail);
        const canSendOtp = user && user.authProvider === 'LOCAL' && user.isActive;
        if (canSendOtp) {
            const otp = (0, generateOtp_1.generateOtp)();
            await this.otpService.storeOtp({
                userId: user.id,
                email: user.email,
                otp,
                purpose: 'PASSWORD_RESET',
            });
            await this.emailService.sendPasswordResetOtp(user.email, otp);
        }
        return {
            email: normalizedEmail,
            otpExpiresInSeconds: env_1.env.OTP_EXPIRES_IN_SECONDS,
        };
    }
};
exports.RequestPasswordResetOtpUseCase = RequestPasswordResetOtpUseCase;
exports.RequestPasswordResetOtpUseCase = RequestPasswordResetOtpUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.EmailService)),
    __param(2, (0, tsyringe_1.inject)(tokens_1.TOKENS.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RequestPasswordResetOtpUseCase);
