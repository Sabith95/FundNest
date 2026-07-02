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
exports.RegisterUserUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../shared/tokens");
const AppError_1 = require("../../../shared/errors/AppError");
const constants_1 = require("../../../shared/constants");
const constants_2 = require("../../../shared/constants");
const generateOtp_1 = require("../../../shared/utils/generateOtp");
let RegisterUserUseCase = class RegisterUserUseCase {
    constructor(userRepository, bcryptService, emailService, otpService) {
        this.userRepository = userRepository;
        this.bcryptService = bcryptService;
        this.emailService = emailService;
        this.otpService = otpService;
    }
    async execute(input) {
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new AppError_1.AppError('Email already registered', constants_1.HTTP_STATUS.CONFLICT);
        }
        const hashedPassword = await this.bcryptService.hashPassword(input.password);
        const user = await this.userRepository.create({
            name: input.name,
            email: input.email,
            phone: input.phone,
            password: hashedPassword,
            role: constants_2.ROLES.USER,
            authProvider: "LOCAL",
            isActive: true,
            isEmailVerified: false,
            profile: {
                address: input.address,
                kycStatus: "PENDING",
            },
        });
        const otp = (0, generateOtp_1.generateOtp)();
        await this.otpService.storeOtp({
            userId: user.id,
            email: user.email,
            otp,
            purpose: "USER_REGISTRATION"
        });
        await this.emailService.sendOtp(user.email, otp);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
                isEmailVerified: user.isEmailVerified,
                profile: user.profile,
            },
            verificationRequired: true,
        };
    }
};
exports.RegisterUserUseCase = RegisterUserUseCase;
exports.RegisterUserUseCase = RegisterUserUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.BcryptService)),
    __param(2, (0, tsyringe_1.inject)(tokens_1.TOKENS.EmailService)),
    __param(3, (0, tsyringe_1.inject)(tokens_1.TOKENS.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], RegisterUserUseCase);
