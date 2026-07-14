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


//Repository
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { TenantRepository } from "../repositories/TenantRepository";
import { ITenantRepository } from "../../domain/repositories/ITenantRepository";


//use cases
import { LoginSuperAdminUseCase } from "../../application/auth/use-cases/LoginSuperAdminUseCase";
import { RegisterUserUseCase } from "../../application/auth/use-cases/RegisterUserUseCase";
import { GoogleUserLoginUseCase } from "../../application/auth/use-cases/GoogleUserLoginUseCase";
import { VerifyUserOtpUseCase } from "../../application/auth/use-cases/VerifyUserOtpUseCase";
import { ResendUserOtpUseCase } from "../../application/auth/use-cases/ResendUserOtpUseCase";
import { RequestPasswordResetOtpUseCase } from "../../application/auth/use-cases/RequestPasswordResetOtpUseCase";
import { VerifyPasswordResetOtpUseCase } from "../../application/auth/use-cases/VerifyPasswordResetOtpUseCase";
import { ResetUserPasswordUseCase } from "../../application/auth/use-cases/ResetUserPasswordUseCase";
import { LoginUserUseCase } from "../../application/auth/use-cases/LoginUserUseCase";
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

//use cases
container.register<LoginSuperAdminUseCase>(TOKENS.LoginSuperAdminUseCase, {
  useClass: LoginSuperAdminUseCase,
});

container.register<RegisterUserUseCase>(TOKENS.RegisterUserUseCase, {
  useClass: RegisterUserUseCase,
});

container.register<GoogleUserLoginUseCase>(TOKENS.GoogleUserLoginUseCase, {
  useClass: GoogleUserLoginUseCase,
});

container.register<VerifyUserOtpUseCase>(TOKENS.VerifyUserOtpUseCase, {
  useClass: VerifyUserOtpUseCase,
})

container.register<ResendUserOtpUseCase>(TOKENS.ResendUserOtpUseCase, {
  useClass: ResendUserOtpUseCase,
});

container.register<RequestPasswordResetOtpUseCase>(TOKENS.RequestPasswordResetOtpUseCase, {
  useClass: RequestPasswordResetOtpUseCase,
});

container.register<VerifyPasswordResetOtpUseCase>(TOKENS.VerifyPasswordResetOtpUseCase, {
  useClass: VerifyPasswordResetOtpUseCase,
});

container.register<ResetUserPasswordUseCase>(TOKENS.ResetUserPasswordUseCase, {
  useClass: ResetUserPasswordUseCase,
});

container.register<LoginUserUseCase>(TOKENS.LoginUserUseCase, {
  useClass: LoginUserUseCase,
});

container.register<GetUserProfileUseCase>(TOKENS.GetUserProfileUseCase, {
  useClass: GetUserProfileUseCase,
});

container.register<UpdateUserProfileUseCase>(TOKENS.UpdateUserProfileUseCase, {
  useClass: UpdateUserProfileUseCase,
});

container.register<UpdateProfilePhotoUseCase>(TOKENS.UpdateProfilePhotoUseCase, {
  useClass: UpdateProfilePhotoUseCase,
});

container.register<ChangeUserPasswordUseCase>(TOKENS.ChangeUserPasswordUseCase, {
  useClass: ChangeUserPasswordUseCase,
});

container.register<RefreshTokenUseCase>(TOKENS.RefreshTokenUseCase,{
        useClass: RefreshTokenUseCase,
});

container.register<RegisterTenantUseCase>(TOKENS.RegisterTenantUseCase,{
  useClass: RegisterTenantUseCase
})

container.register<VerifyTenantOtpUseCase>(TOKENS.VerifyTenantOtpUseCase,{
  useClass: VerifyTenantOtpUseCase,
})

container.register<ResendTenantOtpUseCase>(TOKENS.ResendTenantOtpUseCase,{
  useClass: ResendTenantOtpUseCase
})

container.register<UpdateBusinessInfoUseCase>(TOKENS.UpdateBusinessInfoUseCase,{
  useClass: UpdateBusinessInfoUseCase
})

container.register<UploadKycDocumentsUseCase>(TOKENS.UploadKycDocumentsUseCase, {
  useClass: UploadKycDocumentsUseCase
})



// Respository
container.register<IUserRepository>(TOKENS.UserRepository, {
  useClass: UserRepository,
});

container.register<ITenantRepository>(TOKENS.TenantRepository, {
  useClass: TenantRepository,
})
export { container };