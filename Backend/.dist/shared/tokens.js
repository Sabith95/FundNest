"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKENS = void 0;
exports.TOKENS = {
    //services
    JwtService: Symbol.for('JwtService'),
    BcryptService: Symbol.for("BcryptService"),
    UserRepository: Symbol.for("UserRepository"),
    GoogleAuthService: Symbol.for("GoogleAuthService"),
    OtpService: Symbol.for('OtpService'),
    EmailService: Symbol.for('EmailService'),
    //use cases
    LoginSuperAdminUseCase: Symbol.for("LoginSuperAdminUseCase"),
    RegisterUserUseCase: Symbol.for("RegisterUserUseCase"),
    GoogleUserLoginUseCase: Symbol.for("GoogleUserLoginUseCase"),
    VerifyUserOtpUseCase: Symbol.for('VerifyUserOtpUseCase'),
    ResendUserOtpUseCase: Symbol.for('ResendUserOtpUseCase'),
    RequestPasswordResetOtpUseCase: Symbol.for('RequestPasswordResetOtpUseCase'),
    VerifyPasswordResetOtpUseCase: Symbol.for('VerifyPasswordResetOtpUseCase'),
    ResetUserPasswordUseCase: Symbol.for('ResetUserPasswordUseCase'),
};
