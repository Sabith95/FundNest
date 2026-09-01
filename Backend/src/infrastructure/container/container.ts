import { container } from "tsyringe";
import { TOKENS } from "../../shared/tokens";

//services
import { IJwtService } from "../auth/interfaces/IJwtService";
import { IBcryptService } from "../auth/interfaces/IBcryptService";
import { BcryptService } from "../auth/BcryptService";
import { JwtService } from "../auth/JwtService";
import { IGoogleAuthService } from "../auth/interfaces/IGoogleAuthService";
import { GoogleAuthService } from "../auth/GoogleAuthService";
import { IOtpService } from "../cache/interfaces/IOtpService";
import { RedisOtpService } from "../cache/RedisOtpService";
import { IEmailService } from "../notification/interfaces/IEmailService";
import { EmailService } from "../notification/EmailService";
import { IImageStorageService } from "../storage/interfaces/IImageStorageService";
import { CloudinaryImageStorageService } from "../storage/CloudinaryImageStorageService";
import { IS3StorageService } from "../storage/interfaces/IS3StorageService";
import { S3StorageService } from "../storage/S3StorageService";

//Repository
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { TenantRepository } from "../repositories/TenantRepository";
import { ITenantRepository } from "../../domain/repositories/ITenantRepository";


//use cases
import { LoginSuperAdminUseCase } from "../../application/auth/use-cases/LoginSuperAdminUseCase";
import { ILoginSuperAdminUseCase } from "../../application/interface/auth/ILoginSuperAdminUseCase";
import { RegisterUserUseCase } from "../../application/auth/use-cases/RegisterUserUseCase";
import { IRegisterUserUseCase } from "../../application/interface/auth/IRegisterUseCase";
import { GoogleUserLoginUseCase } from "../../application/auth/use-cases/GoogleUserLoginUseCase";
import { IGoogleUserLoginUseCase } from "../../application/interface/auth/IGoogleUserLoginUseCase";
import { VerifyUserOtpUseCase } from "../../application/auth/use-cases/VerifyUserOtpUseCase";
import { ResendUserOtpUseCase } from "../../application/auth/use-cases/ResendUserOtpUseCase";
import { RequestPasswordResetOtpUseCase } from "../../application/auth/use-cases/RequestPasswordResetOtpUseCase";
import { VerifyPasswordResetOtpUseCase } from "../../application/auth/use-cases/VerifyPasswordResetOtpUseCase";
import { ResetUserPasswordUseCase } from "../../application/auth/use-cases/ResetUserPasswordUseCase";
import { LoginUserUseCase } from "../../application/auth/use-cases/LoginUserUseCase";
import { LoginTenantUseCase } from "../../application/auth/use-cases/LoginTenantUseCase";
import { GetUserProfileUseCase } from "../../application/user/use-cases/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "../../application/user/use-cases/UpdateUserProfileUseCase";
import { UpdateProfilePhotoUseCase } from "../../application/user/use-cases/UpdateProfilePhotoUseCase";
import { ChangeUserPasswordUseCase } from "../../application/user/use-cases/ChangeUserPasswordUseCase";
import { RefreshTokenUseCase } from "../../application/auth/use-cases/RefreshTokenUseCase";
import { RegisterTenantUseCase } from "../../application/auth/use-cases/RegisterTenantUseCase";
import { VerifyTenantOtpUseCase } from "../../application/auth/use-cases/VerifyTenantOtpUseCase";
import { ResendTenantOtpUseCase } from "../../application/auth/use-cases/ResendTenantOtpUseCase";
import { UpdateBusinessInfoUseCase } from "../../application/tenant/use-cases/UpdateBusinessInfoUseCase";
import { UploadKycDocumentsUseCase } from "../../application/tenant/use-cases/UploadKycDocumentsUseCase";
import { UpdateBankDetailsUseCase } from "../../application/tenant/use-cases/UpdateBankDetailsUseCase";
import { IVerifyUserOtpUseCase } from "../../application/interface/auth/IVerifyUserOtpUseCase";
import { IResendUserOtpUseCase } from "../../application/interface/auth/IResendUserOtpUseCase";
import { IRequestPasswordResetOtpUseCase } from "../../application/interface/auth/IRequestPasswordResetOtpUseCase";
import { IVerifyPasswordResetOtpUseCase } from "../../application/interface/auth/IVerifyPasswordResetOtpUseCase";
import { IResetUserPasswordUseCase } from "../../application/interface/auth/IResetUserPasswordUseCase";
import { ILoginUserUseCase } from "../../application/interface/auth/ILoginUserUseCase";
import { ILoginTenantUseCase } from "../../application/interface/auth/ILoginTenantUseCase";
import { IRefreshTokenUseCase } from "../../application/interface/auth/IRefreshTokenUseCase";
import { IRegisterTenantUseCase } from "../../application/interface/tenant/IRegisterTenantUseCase";
import { IVerifyTenantOtpUseCase } from "../../application/interface/tenant/IVerifyTenantOtpUseCase";
import { IResendTenantOtpUseCase } from "../../application/interface/tenant/IResendTenantOtpUseCase";
import { IGetUserProfileUseCase } from "../../application/interface/user/IGetUserProfileUseCase";
import { IUpdateUserProfileUseCase } from "../../application/interface/user/IUpdateUserProfileUseCase";
import { IUpdateProfilePhotoUseCase } from "../../application/interface/user/IUpdateProfilePhotoUseCase";
import { IChangeUserPasswordUseCase } from "../../application/interface/user/IChangeUserPasswordUseCase";
import { IUpdateBankDetailsUseCase } from "../../application/interface/tenant/IUpdateBankDetailsUseCase";
import { IUpdateBusinessInfoUseCase } from "../../application/interface/tenant/IUpdateBusinessInfoUseCase";
import { IUploadKycDocumentsUseCase } from "../../application/interface/tenant/IUploadKycDocumentsUseCase";
import { GetAllTenantUseCase } from "../../application/admin/use-cases/GetAllTenantUseCase";
import { IGetAllTenantsUseCase } from "../../application/interface/admin/IGetAllTenantsUseCase";
import { IGetTenantByIdUseCase } from "../../application/interface/admin/IGetTenantByIdUseCase";
import { GetTenantByIdUseCase } from "../../application/admin/use-cases/GetTenantByIdUseCase";
import { IUpdateTenantStatusUseCase } from "../../application/interface/admin/IUpdateTenantStatusUseCase";
import { UpdateTenantStatusUseCase } from "../../application/admin/use-cases/UpdateTenantStatusUseCase";
import { IGetAllUsersUseCase } from "../../application/interface/admin/IGetAllUserUseCase";
import { GetAllUserUseCase } from "../../application/admin/use-cases/GetAllUserUseCase";
import { IUpdateUserStatusUseCase } from "../../application/interface/admin/IUpdateUserStatus";
import { UpdateUserStatusUseCase } from "../../application/admin/use-cases/UpdateUserStatusUseCase";
import { GetUserByIdUseCase } from "../../application/admin/use-cases/GetUserByIdUseCase";
import { IGetUserByIdUseCase } from "../../application/interface/admin/IGetUserByIdUseCase";
import { IVerifyBusinessDetailsUseCase } from "../../application/interface/admin/IVerifyBusinessDetailsUseCase";
import { VerifyBusinessDetailsUseCase } from "../../application/admin/use-cases/VerifyBusinessDetailsUseCase";
import { IVerifyKycDocumentsUseCase } from "../../application/interface/admin/IVerifyKycDocumentsUseCase";
import { VerifyKycDocumentsUseCase } from "../../application/admin/use-cases/VerifyKycDocumentsUseCase";
import { IVerifyBankDetailsUseCase } from "../../application/interface/admin/IVerifyBankDetailsUseCase";
import { VerifyBankDetailsUseCase } from "../../application/admin/use-cases/VerifyBankDetailsUseCase";
import { IGenerateUploadUrlUseCase } from "../../application/interface/storage/IGenerateUploadUrlUseCase";
import { GenerateUploadUrlUseCase } from "../../application/storage/use-cases/GenerateUploadUrlUseCase";
import { IGenerateDownloadUrlUseCase } from "../../application/interface/storage/IGenerateDownloadUrlUseCase";
import { GenerateDownloadUrlUseCase } from "../../application/storage/use-cases/GenerateDownloadUrlUseCase";
import { ICompleteTenantVerificationUseCase } from "../../application/interface/admin/ICompleteTenantVerificationUseCase";
import { CompleteTenantVerificationUseCase } from "../../application/admin/use-cases/CompleteTenantVerificationUseCase";


// Services
container.register<IJwtService>(TOKENS.JwtService, {
  useClass: JwtService,
});

container.register<IBcryptService>(TOKENS.BcryptService, {
  useClass: BcryptService,
});

container.register<IGoogleAuthService>(TOKENS.GoogleAuthService, {
  useClass: GoogleAuthService,
});

container.register<IEmailService>(TOKENS.EmailService, {
  useClass: EmailService,
})

container.register<IOtpService>(TOKENS.OtpService, {
  useClass: RedisOtpService,
})

container.register<IImageStorageService>(TOKENS.ImageStorageService, {
  useClass: CloudinaryImageStorageService,
});

container.register<IS3StorageService>(TOKENS.S3StorageService, {
  useClass: S3StorageService,
})

//use cases
container.register<ILoginSuperAdminUseCase>(TOKENS.LoginSuperAdminUseCase, {
  useClass: LoginSuperAdminUseCase,
});

container.register<IRegisterUserUseCase>(TOKENS.RegisterUserUseCase, {
  useClass: RegisterUserUseCase,
});

container.register<IGoogleUserLoginUseCase>(TOKENS.GoogleUserLoginUseCase, {
  useClass: GoogleUserLoginUseCase,
});

container.register<IVerifyUserOtpUseCase>(TOKENS.VerifyUserOtpUseCase, {
  useClass: VerifyUserOtpUseCase,
})

container.register<IResendUserOtpUseCase>(TOKENS.ResendUserOtpUseCase, {
  useClass: ResendUserOtpUseCase,
});

container.register<IRequestPasswordResetOtpUseCase>(TOKENS.RequestPasswordResetOtpUseCase, {
  useClass: RequestPasswordResetOtpUseCase,
});

container.register<IVerifyPasswordResetOtpUseCase>(TOKENS.VerifyPasswordResetOtpUseCase, {
  useClass: VerifyPasswordResetOtpUseCase,
});

container.register<IResetUserPasswordUseCase>(TOKENS.ResetUserPasswordUseCase, {
  useClass: ResetUserPasswordUseCase,
});

container.register<ILoginUserUseCase>(TOKENS.LoginUserUseCase, {
  useClass: LoginUserUseCase,
});

container.register<ILoginTenantUseCase>(TOKENS.LoginTenantUseCase, {
  useClass: LoginTenantUseCase,
});
container.register<IGetUserProfileUseCase>(TOKENS.GetUserProfileUseCase, {
  useClass: GetUserProfileUseCase,
});

container.register<IUpdateUserProfileUseCase>(TOKENS.UpdateUserProfileUseCase, {
  useClass: UpdateUserProfileUseCase,
});

container.register<IUpdateProfilePhotoUseCase>(TOKENS.UpdateProfilePhotoUseCase, {
  useClass: UpdateProfilePhotoUseCase,
});

container.register<IChangeUserPasswordUseCase>(TOKENS.ChangeUserPasswordUseCase, {
  useClass: ChangeUserPasswordUseCase,
});

container.register<IRefreshTokenUseCase>(TOKENS.RefreshTokenUseCase,{
        useClass: RefreshTokenUseCase,
});

container.register<IRegisterTenantUseCase>(TOKENS.RegisterTenantUseCase,{
  useClass: RegisterTenantUseCase
})

container.register<IVerifyTenantOtpUseCase>(TOKENS.VerifyTenantOtpUseCase,{
  useClass: VerifyTenantOtpUseCase,
})

container.register<IResendTenantOtpUseCase>(TOKENS.ResendTenantOtpUseCase,{
  useClass: ResendTenantOtpUseCase
})

container.register<IUpdateBusinessInfoUseCase>(TOKENS.UpdateBusinessInfoUseCase,{
  useClass: UpdateBusinessInfoUseCase
})

container.register<IUploadKycDocumentsUseCase>(TOKENS.UploadKycDocumentsUseCase, {
  useClass: UploadKycDocumentsUseCase
})


container.register<IUpdateBankDetailsUseCase>(TOKENS.UpdateBankDetailsUseCase, {
  useClass: UpdateBankDetailsUseCase
})


container.register<IGetAllTenantsUseCase>(TOKENS.GetAllTenantsUseCase, {
  useClass: GetAllTenantUseCase,
})

container.register<IGetTenantByIdUseCase>(TOKENS.GetTenantByIdUseCase, {
  useClass: GetTenantByIdUseCase
})

container.register<IUpdateTenantStatusUseCase>(TOKENS.UpdateTenantStatusUseCase, {
  useClass: UpdateTenantStatusUseCase
})

container.register<IGetAllUsersUseCase>(TOKENS.GetAllUsersUseCase, {
  useClass: GetAllUserUseCase
})

container.register<IUpdateUserStatusUseCase>(TOKENS.UpdateUserStatusUseCase, {
  useClass: UpdateUserStatusUseCase
});

container.register<IGetUserByIdUseCase>(TOKENS.GetUserByIdUseCase, {
  useClass: GetUserByIdUseCase
})

container.register<IVerifyBusinessDetailsUseCase>(TOKENS.VerifyBusinessDetailsUseCase, {
  useClass: VerifyBusinessDetailsUseCase,
});
container.register<IVerifyKycDocumentsUseCase>(TOKENS.VerifyKycDocumentsUseCase, {
  useClass: VerifyKycDocumentsUseCase,
});
container.register<IVerifyBankDetailsUseCase>(TOKENS.VerifyBankDetailsUseCase, {
  useClass: VerifyBankDetailsUseCase,
});

container.register<IGenerateUploadUrlUseCase>(TOKENS.GenerateUploadUrlUseCase, {
  useClass: GenerateUploadUrlUseCase,
});

container.register<IGenerateDownloadUrlUseCase>(TOKENS.GenerateDownloadUrlUseCase, {
  useClass: GenerateDownloadUrlUseCase,
});

container.register<ICompleteTenantVerificationUseCase>(TOKENS.CompleteTenantVerificationUseCase, {
  useClass: CompleteTenantVerificationUseCase,
});

// Respository
container.register<IUserRepository>(TOKENS.UserRepository, {
  useClass: UserRepository,
});

container.register<ITenantRepository>(TOKENS.TenantRepository, {
  useClass: TenantRepository,
})
export { container };