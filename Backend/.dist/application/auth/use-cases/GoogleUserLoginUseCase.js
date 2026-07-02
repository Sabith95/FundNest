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
exports.GoogleUserLoginUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../shared/tokens");
const AppError_1 = require("../../../shared/errors/AppError");
const constants_1 = require("../../../shared/constants");
let GoogleUserLoginUseCase = class GoogleUserLoginUseCase {
    constructor(userRepository, googleAuthService, jwtService) {
        this.userRepository = userRepository;
        this.googleAuthService = googleAuthService;
        this.jwtService = jwtService;
    }
    async execute(input) {
        const googleUser = await this.googleAuthService.verifyIdToken(input.idToken);
        let user = await this.userRepository.findByGoogleId(googleUser.googleId);
        if (!user) {
            const existingUserEmail = await this.userRepository.findByEmail(googleUser.email);
            if (existingUserEmail && existingUserEmail.authProvider !== "GOOGLE") {
                throw new AppError_1.AppError('Email id already registered with password login', constants_1.HTTP_STATUS.CONFLICT);
            }
            user = await this.userRepository.create({
                name: googleUser.name,
                email: googleUser.email,
                role: constants_1.ROLES.USER,
                authProvider: "GOOGLE",
                googleId: googleUser.googleId,
                isEmailVerified: true,
                isActive: true,
                profile: {
                    kycStatus: "PENDING",
                },
            });
        }
        if (!user.isActive) {
            throw new AppError_1.AppError('Inactive account', constants_1.HTTP_STATUS.FORBIDDEN);
        }
        const tokens = this.jwtService.generateTokenPair({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            tokens
        };
    }
};
exports.GoogleUserLoginUseCase = GoogleUserLoginUseCase;
exports.GoogleUserLoginUseCase = GoogleUserLoginUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.GoogleAuthService)),
    __param(2, (0, tsyringe_1.inject)(tokens_1.TOKENS.JwtService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GoogleUserLoginUseCase);
