export const TOKENS = {
  //services
  JwtService: Symbol.for("JwtService"),
  BcryptService: Symbol.for("BcryptService"),
  GoogleAuthService: Symbol.for("GoogleAuthService"),
  OtpService: Symbol.for("OtpService"),
  EmailService: Symbol.for("EmailService"),
  ImageStorageService: Symbol.for("ImageStorageService"),
  S3StorageService: Symbol.for("S3StorageService"),

  //use cases
  LoginSuperAdminUseCase: Symbol.for("LoginSuperAdminUseCase"),
  RegisterUserUseCase: Symbol.for("RegisterUserUseCase"),
  GoogleUserLoginUseCase: Symbol.for("GoogleUserLoginUseCase"),
  VerifyUserOtpUseCase: Symbol.for("VerifyUserOtpUseCase"),
  ResendUserOtpUseCase: Symbol.for("ResendUserOtpUseCase"),
  RequestPasswordResetOtpUseCase: Symbol.for("RequestPasswordResetOtpUseCase"),
  VerifyPasswordResetOtpUseCase: Symbol.for("VerifyPasswordResetOtpUseCase"),
  ResetUserPasswordUseCase: Symbol.for("ResetUserPasswordUseCase"),
  LoginUserUseCase: Symbol.for("LoginUserUseCase"),
  LoginTenantUseCase: Symbol.for("LoginTenantUseCase"),
  GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),
  UpdateUserProfileUseCase: Symbol.for("UpdateUserProfileUseCase"),
  UpdateProfilePhotoUseCase: Symbol.for("UpdateProfilePhotoUseCase"),
  ChangeUserPasswordUseCase: Symbol.for("ChangeUserPasswordUseCase"),
  RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),
  RegisterTenantUseCase: Symbol.for("RegisterTenantUseCase"),
  VerifyTenantOtpUseCase: Symbol.for("VerifyTenantOtpUseCase"),
  ResendTenantOtpUseCase: Symbol.for("ResendTenantOtpUseCase"),
  UpdateBusinessInfoUseCase: Symbol.for("UpdateBusinessInfoUseCase"),
  UploadKycDocumentsUseCase: Symbol.for("UploadKycDocumentsUseCase"),
  UpdateBankDetailsUseCase: Symbol.for("UpdateBankDetailsUseCase"),
  GetAllTenantsUseCase: Symbol.for("GetAllTenantsUseCase"),
  GetTenantByIdUseCase: Symbol.for("GetTenantByIdUseCase"),
  UpdateTenantStatusUseCase: Symbol.for("UpdateTenantStatusUseCase"),
  GetAllUsersUseCase: Symbol.for("GetAllUsersUseCase"),
  UpdateUserStatusUseCase: Symbol.for("UpdateUserStatusUseCase"),
  GetUserByIdUseCase: Symbol.for("GetUserByIdUseCase"),
  VerifyBusinessDetailsUseCase: Symbol.for("VerifyBusinessDetailsUseCase"),
  VerifyKycDocumentsUseCase: Symbol.for("VerifyKycDocumentsUseCase"),
  VerifyBankDetailsUseCase: Symbol.for("VerifyBankDetailsUseCase"),
  GenerateUploadUrlUseCase: Symbol.for("GenerateUploadUrlUseCase"),
  GenerateDownloadUrlUseCase: Symbol.for("GenerateDownloadUrlUseCase"),
  CompleteTenantVerificationUseCase: Symbol.for(
    "CompleteTenantVerificationUseCase",
  ),
  GetTenantProfileUseCase: Symbol.for("GetTenantProfileUseCase"),
  RequestTenantPasswordResetOtpUseCase: Symbol.for(
    "RequestTenantPasswordResetOtpUseCase",
  ),
  VerifyTenantPasswordResetOtpUseCase: Symbol.for(
    "VerifyTenantPasswordResetOtpUseCase",
  ),
  ResetTenantPasswordUseCase: Symbol.for("ResetTenantPasswordUseCase"),
  CreateSubscriptionPlanUseCase: Symbol.for("CreateSubscriptionPlanUseCase"),
  GetSubscriptionPlansUseCase: Symbol.for("GetSubscriptionPlansUseCase"),
  UpdateSubscriptionPlanUseCase: Symbol.for("UpdateSubscriptionPlanUseCase"),
  UpdateSubscriptionPlanStatusUseCase: Symbol.for(
    "UpdateSubscriptionPlanStatusUseCase",
  ),
  GetAvailableSubscriptionPlansUseCase: Symbol.for(
    "GetAvailableSubscriptionPlansUseCase",
  ),
  CreateSubscriptionCheckoutUseCase: Symbol.for(
    "CreateSubscriptionCheckoutUseCase",
  ),
  VerifySubscriptionCheckoutUseCase: Symbol.for(
    "VerifySubscriptionCheckoutUseCase",
  ),
  GetCurrentTenantSubscriptionUseCase: Symbol.for(
    "GetCurrentTenantSubscriptionUseCase",
  ),
  HandlePaymentWebhookUseCase: Symbol.for("HandlePaymentWebhookUseCase"),
  RazorpayPaymentService: Symbol.for("RazorpayPaymentService"),

  //repositories

  TenantRepository: Symbol.for("TenantRepository"),
  UserRepository: Symbol.for("UserRepository"),
  SubscriptionPlanRepository: Symbol.for("SubscriptionPlanRepository"),
  SubscriptionCheckoutRepository: Symbol.for("SubscriptionCheckoutRepository"),
  TenantSubscriptionRepository: Symbol.for("TenantSubscriptionRepository"),
} as const;
