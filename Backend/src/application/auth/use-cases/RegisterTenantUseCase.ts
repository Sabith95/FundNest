import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";

import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";

import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { IEmailService } from "../../../infrastructure/notification/interfaces/IEmailService";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";

import { AppError } from "../../../shared/errors/AppError";

import { RegisterTenantDto, RegisterTenantResponseDto } from "../dto/RegisterTenantDto";
import { generateOtp } from "../../../shared/utils/generateOtp";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../shared/constants/messages";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";


@injectable()
export class RegisterTenantUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository,
        @inject(TOKENS.BcryptService)
        private readonly _bcryptService: IBcryptService,
        @inject(TOKENS.EmailService)
        private readonly _emailService: IEmailService,
        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService
    ){}

    async execute(input: RegisterTenantDto): Promise<RegisterTenantResponseDto> {
        
        const existingTenant = await this._tenantRepository.findByEmail(input.email)
        if(existingTenant){
            throw new AppError(
                MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED,
                HTTP_STATUS.CONFLICT
            )
        }

        const hashedPassword = await this._bcryptService.hashPassword(
            input.password
        )

        const tenant = await this._tenantRepository.create({
            companyName: input.companyName,
            ownerName: input.ownerName,
            email: input.email,
            phone: input.phone,
            password: hashedPassword,
            isEmailVerified: false,
        })

        const otp = generateOtp()
        
        await this._otpService.storeOtp({
            userId: tenant.id,
            email:  tenant.email,
            otp,
            purpose: OtpPurpose.TENANT_REGISTRATION
        })

        await this._emailService.sendOtp(tenant.email,otp)

        return {
            tenant: {
            id: tenant.id,
            companyName: tenant.companyName,
            ownerName: tenant.ownerName,
            email: tenant.email,
            phone: tenant.phone,
            isActive: tenant.isActive,
            isEmailVerified: tenant.isEmailVerified,
            status: tenant.status,
            onboardingStep: tenant.onboardingStep,
            },

        }
    }
}