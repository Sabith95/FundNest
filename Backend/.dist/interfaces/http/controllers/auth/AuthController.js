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
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../../shared/tokens");
const LoginSuperAdminUseCase_1 = require("../../../../application/auth/use-cases/LoginSuperAdminUseCase");
const ApiResponse_1 = require("../../../../shared/ApiResponse");
const constants_1 = require("../../../../shared/constants");
const authValidator_1 = require("../../validators/authValidator");
const RegisterUserUseCase_1 = require("../../../../application/auth/use-cases/RegisterUserUseCase");
const GoogleUserLoginUseCase_1 = require("../../../../application/auth/use-cases/GoogleUserLoginUseCase");
const VerifyUserOtpUseCase_1 = require("../../../../application/auth/use-cases/VerifyUserOtpUseCase");
const ResendUserOtpUseCase_1 = require("../../../../application/auth/use-cases/ResendUserOtpUseCase");
const authValidator_2 = require("../../validators/authValidator");
const RequestPasswordResetOtpUseCase_1 = require("../../../../application/auth/use-cases/RequestPasswordResetOtpUseCase");
const VerifyPasswordResetOtpUseCase_1 = require("../../../../application/auth/use-cases/VerifyPasswordResetOtpUseCase");
const ResetUserPasswordUseCase_1 = require("../../../../application/auth/use-cases/ResetUserPasswordUseCase");
let AuthController = class AuthController {
    constructor(loginSuperAdminUseCase, registerUserUserCase, googleUserLoginUseCase, verifyUserOtpUseCase, resendUserOtpUseCase, requestPasswordResetOtpUseCase, verifyPasswordResetOtpUseCase, resetUserPasswordUseCase) {
        this.loginSuperAdminUseCase = loginSuperAdminUseCase;
        this.registerUserUserCase = registerUserUserCase;
        this.googleUserLoginUseCase = googleUserLoginUseCase;
        this.verifyUserOtpUseCase = verifyUserOtpUseCase;
        this.resendUserOtpUseCase = resendUserOtpUseCase;
        this.requestPasswordResetOtpUseCase = requestPasswordResetOtpUseCase;
        this.verifyPasswordResetOtpUseCase = verifyPasswordResetOtpUseCase;
        this.resetUserPasswordUseCase = resetUserPasswordUseCase;
        this.loginSuperAdmin = async (req, res, next) => {
            try {
                const payload = authValidator_1.loginSchema.parse(req.body);
                const result = await this.loginSuperAdminUseCase.execute(payload);
                res.status(constants_1.HTTP_STATUS.OK)
                    .json(ApiResponse_1.ApiResponse.success(result, 'Super admin logged in successfully'));
            }
            catch (error) {
                next(error);
            }
        };
        this.registerUser = async (req, res, next) => {
            try {
                const payload = authValidator_1.registerUserSchema.parse(req.body);
                const result = await this.registerUserUserCase.execute(payload);
                res
                    .status(constants_1.HTTP_STATUS.CREATED)
                    .json(ApiResponse_1.ApiResponse.success(result, "User registered successfully", constants_1.HTTP_STATUS.CREATED));
            }
            catch (error) {
                next(error);
            }
        };
        this.googleUserLogin = async (req, res, next) => {
            try {
                const payload = authValidator_1.googleLoginSchema.parse(req.body);
                const result = await this.googleUserLoginUseCase.execute(payload);
                res
                    .status(constants_1.HTTP_STATUS.OK)
                    .json(ApiResponse_1.ApiResponse.success(result, "Google login successful"));
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyUserOtp = async (req, res, next) => {
            try {
                const payload = authValidator_1.verifyOtpSchema.parse(req.body);
                const result = await this.verifyUserOtpUseCase.execute(payload);
                res
                    .status(constants_1.HTTP_STATUS.OK)
                    .json(ApiResponse_1.ApiResponse.success(result, "Otp verified successfully"));
            }
            catch (error) {
                next(error);
            }
        };
        this.resendUserOtp = async (req, res, next) => {
            try {
                const payload = authValidator_2.resendOtpSchema.parse(req.body);
                const result = await this.resendUserOtpUseCase.execute(payload);
                res
                    .status(constants_1.HTTP_STATUS.OK)
                    .json(ApiResponse_1.ApiResponse.success(result, 'OTP resent successfully'));
            }
            catch (error) {
                next(error);
            }
        };
        this.requestPasswordResetOtp = async (req, res, next) => {
            try {
                const payload = authValidator_2.forgotPasswordSchema.parse(req.body);
                const result = await this.requestPasswordResetOtpUseCase.execute(payload);
                res.status(constants_1.HTTP_STATUS.OK).json(ApiResponse_1.ApiResponse.success(result, 'Password reset OTP sent successfully'));
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyPasswordResetOtp = async (req, res, next) => {
            try {
                const payload = authValidator_1.verifyOtpSchema.parse(req.body);
                const result = await this.verifyPasswordResetOtpUseCase.execute(payload);
                res.status(constants_1.HTTP_STATUS.OK).json(ApiResponse_1.ApiResponse.success(result, 'Password reset OTP verified successfully'));
            }
            catch (error) {
                next(error);
            }
        };
        this.resetUserPassword = async (req, res, next) => {
            try {
                const payload = authValidator_2.resetPasswordSchema.parse(req.body);
                const result = await this.resetUserPasswordUseCase.execute(payload);
                res.status(constants_1.HTTP_STATUS.OK).json(ApiResponse_1.ApiResponse.success(result, 'Password reset successfully'));
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.LoginSuperAdminUseCase)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.RegisterUserUseCase)),
    __param(2, (0, tsyringe_1.inject)(tokens_1.TOKENS.GoogleUserLoginUseCase)),
    __param(3, (0, tsyringe_1.inject)(tokens_1.TOKENS.VerifyUserOtpUseCase)),
    __param(4, (0, tsyringe_1.inject)(tokens_1.TOKENS.ResendUserOtpUseCase)),
    __param(5, (0, tsyringe_1.inject)(tokens_1.TOKENS.RequestPasswordResetOtpUseCase)),
    __param(6, (0, tsyringe_1.inject)(tokens_1.TOKENS.VerifyPasswordResetOtpUseCase)),
    __param(7, (0, tsyringe_1.inject)(tokens_1.TOKENS.ResetUserPasswordUseCase)),
    __metadata("design:paramtypes", [LoginSuperAdminUseCase_1.LoginSuperAdminUseCase,
        RegisterUserUseCase_1.RegisterUserUseCase,
        GoogleUserLoginUseCase_1.GoogleUserLoginUseCase,
        VerifyUserOtpUseCase_1.VerifyUserOtpUseCase,
        ResendUserOtpUseCase_1.ResendUserOtpUseCase,
        RequestPasswordResetOtpUseCase_1.RequestPasswordResetOtpUseCase,
        VerifyPasswordResetOtpUseCase_1.VerifyPasswordResetOtpUseCase,
        ResetUserPasswordUseCase_1.ResetUserPasswordUseCase])
], AuthController);
