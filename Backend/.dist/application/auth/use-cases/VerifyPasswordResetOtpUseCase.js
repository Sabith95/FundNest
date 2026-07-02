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
exports.VerifyPasswordResetOtpUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../shared/tokens");
const AppError_1 = require("../../../shared/errors/AppError");
const constants_1 = require("../../../shared/constants");
let VerifyPasswordResetOtpUseCase = class VerifyPasswordResetOtpUseCase {
    constructor(userRepository, otpService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
    }
    async execute(input) {
        const normalizedEmail = input.email.toLowerCase().trim();
        const user = await this.userRepository.findByEmail(normalizedEmail);
        if (!user || user.authProvider !== 'LOCAL' || !user.isActive) {
            throw new AppError_1.AppError('Invalid OTP', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        const verified = await this.otpService.verifyOtp({
            email: user.email,
            otp: input.otp,
            purpose: 'PASSWORD_RESET',
        });
        if (verified.userId !== user.id) {
            throw new AppError_1.AppError('Invalid OTP', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        await this.otpService.createPasswordResetSession(user.email, user.id);
        return {
            email: user.email,
            verified: true,
        };
    }
};
exports.VerifyPasswordResetOtpUseCase = VerifyPasswordResetOtpUseCase;
exports.VerifyPasswordResetOtpUseCase = VerifyPasswordResetOtpUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.OtpService)),
    __metadata("design:paramtypes", [Object, Object])
], VerifyPasswordResetOtpUseCase);
