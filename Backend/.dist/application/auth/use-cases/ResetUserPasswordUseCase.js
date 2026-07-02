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
exports.ResetUserPasswordUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../shared/tokens");
const AppError_1 = require("../../../shared/errors/AppError");
const constants_1 = require("../../../shared/constants");
let ResetUserPasswordUseCase = class ResetUserPasswordUseCase {
    constructor(userRepository, bcryptService, otpService) {
        this.userRepository = userRepository;
        this.bcryptService = bcryptService;
        this.otpService = otpService;
    }
    async execute(input) {
        if (input.password !== input.confirmPassword) {
            throw new AppError_1.AppError('Passwords do not match', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new AppError_1.AppError('User not found', constants_1.HTTP_STATUS.NOT_FOUND);
        }
        if (user.authProvider !== 'LOCAL') {
            throw new AppError_1.AppError('This account uses Google login', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        const session = await this.otpService.consumePasswordResetSession(user.email);
        if (session.userId !== user.id) {
            throw new AppError_1.AppError('Password reset session expired. Please verify OTP again.', constants_1.HTTP_STATUS.BAD_REQUEST);
        }
        const hashedPassword = await this.bcryptService.hashPassword(input.password);
        await this.userRepository.updatePassword(user.id, hashedPassword);
        return {
            email: user.email,
            passwordReset: true,
        };
    }
};
exports.ResetUserPasswordUseCase = ResetUserPasswordUseCase;
exports.ResetUserPasswordUseCase = ResetUserPasswordUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.BcryptService)),
    __param(2, (0, tsyringe_1.inject)(tokens_1.TOKENS.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ResetUserPasswordUseCase);
