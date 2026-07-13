export const TOKENS = {

    //services
    JwtService: Symbol.for('JwtService'),
    BcryptService: Symbol.for("BcryptService"),
    GoogleAuthService: Symbol.for("GoogleAuthService"),
    OtpService: Symbol.for('OtpService'),
    EmailService: Symbol.for('EmailService'),
    ImageStorageService: Symbol.for("ImageStorageService"),


    //use cases
    LoginSuperAdminUseCase: Symbol.for("LoginSuperAdminUseCase"),
    RegisterUserUseCase: Symbol.for("RegisterUserUseCase"),
    GoogleUserLoginUseCase: Symbol.for("GoogleUserLoginUseCase"),
    VerifyUserOtpUseCase: Symbol.for('VerifyUserOtpUseCase'),
    ResendUserOtpUseCase: Symbol.for('ResendUserOtpUseCase'),
    RequestPasswordResetOtpUseCase: Symbol.for('RequestPasswordResetOtpUseCase'),
    VerifyPasswordResetOtpUseCase: Symbol.for('VerifyPasswordResetOtpUseCase'),
    ResetUserPasswordUseCase: Symbol.for('ResetUserPasswordUseCase'),
    LoginUserUseCase: Symbol.for("LoginUserUseCase"),
    GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),
    UpdateUserProfileUseCase: Symbol.for("UpdateUserProfileUseCase"),
    UpdateProfilePhotoUseCase: Symbol.for("UpdateProfilePhotoUseCase"),
    ChangeUserPasswordUseCase: Symbol.for("ChangeUserPasswordUseCase"),
    RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),
    RegisterTenantUseCase: Symbol.for("RegisterTenantUseCase"),
    VerifyTenantOtpUseCase: Symbol.for("VerifyTenantOtpUseCase"),
    ResendTenantOtpUseCase: Symbol.for("ResendTenantOtpUseCase"),

    //repositories

    TenantRepository: Symbol.for("TenantRepository"),
    UserRepository: Symbol.for("UserRepository"),
    
}as const