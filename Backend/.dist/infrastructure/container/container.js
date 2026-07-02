"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return tsyringe_1.container; } });
const tokens_1 = require("../../shared/tokens");
const BcryptService_1 = require("../auth/BcryptService");
const JwtService_1 = require("../auth/JwtService");
const GoogleAuthService_1 = require("../auth/GoogleAuthService");
const RedisOtpService_1 = require("../cache/RedisOtpService");
const EmailService_1 = require("../notification/EmailService");
const UserRepository_1 = require("../repositories/UserRepository");
//use cases
const LoginSuperAdminUseCase_1 = require("../../application/auth/use-cases/LoginSuperAdminUseCase");
const RegisterUserUseCase_1 = require("../../application/auth/use-cases/RegisterUserUseCase");
const GoogleUserLoginUseCase_1 = require("../../application/auth/use-cases/GoogleUserLoginUseCase");
const VerifyUserOtpUseCase_1 = require("../../application/auth/use-cases/VerifyUserOtpUseCase");
const ResendUserOtpUseCase_1 = require("../../application/auth/use-cases/ResendUserOtpUseCase");
const RequestPasswordResetOtpUseCase_1 = require("../../application/auth/use-cases/RequestPasswordResetOtpUseCase");
const VerifyPasswordResetOtpUseCase_1 = require("../../application/auth/use-cases/VerifyPasswordResetOtpUseCase");
const ResetUserPasswordUseCase_1 = require("../../application/auth/use-cases/ResetUserPasswordUseCase");
// Services
tsyringe_1.container.register(tokens_1.TOKENS.JwtService, {
    useClass: JwtService_1.JwtService,
});
tsyringe_1.container.register(tokens_1.TOKENS.BcryptService, {
    useClass: BcryptService_1.BcryptService,
});
tsyringe_1.container.register(tokens_1.TOKENS.GoogleAuthService, {
    useClass: GoogleAuthService_1.GoogleAuthService,
});
tsyringe_1.container.register(tokens_1.TOKENS.EmailService, {
    useClass: EmailService_1.EmailService,
});
tsyringe_1.container.register(tokens_1.TOKENS.OtpService, {
    useClass: RedisOtpService_1.RedisOtpService,
});
//use cases
tsyringe_1.container.register(tokens_1.TOKENS.LoginSuperAdminUseCase, {
    useClass: LoginSuperAdminUseCase_1.LoginSuperAdminUseCase,
});
tsyringe_1.container.register(tokens_1.TOKENS.RegisterUserUseCase, {
    useClass: RegisterUserUseCase_1.RegisterUserUseCase,
});
tsyringe_1.container.register(tokens_1.TOKENS.GoogleUserLoginUseCase, {
    useClass: GoogleUserLoginUseCase_1.GoogleUserLoginUseCase,
});
tsyringe_1.container.register(tokens_1.TOKENS.VerifyUserOtpUseCase, {
    useClass: VerifyUserOtpUseCase_1.VerifyUserOtpUseCase,
});
tsyringe_1.container.register(tokens_1.TOKENS.ResendUserOtpUseCase, {
    useClass: ResendUserOtpUseCase_1.ResendUserOtpUseCase,
});
tsyringe_1.container.register(tokens_1.TOKENS.RequestPasswordResetOtpUseCase, {
    useClass: RequestPasswordResetOtpUseCase_1.RequestPasswordResetOtpUseCase,
});
tsyringe_1.container.register(tokens_1.TOKENS.VerifyPasswordResetOtpUseCase, {
    useClass: VerifyPasswordResetOtpUseCase_1.VerifyPasswordResetOtpUseCase,
});
tsyringe_1.container.register(tokens_1.TOKENS.ResetUserPasswordUseCase, {
    useClass: ResetUserPasswordUseCase_1.ResetUserPasswordUseCase,
});
// Respository
tsyringe_1.container.register(tokens_1.TOKENS.UserRepository, {
    useClass: UserRepository_1.UserRepository,
});
