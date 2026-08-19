import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";

import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";

import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { IEmailService } from "../../../infrastructure/notification/interfaces/IEmailService";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";

import { RegisterTenantDto, RegisterTenantResponseDto } from "../dto/RegisterTenantDto";
import { generateOtp } from "../../../shared/utils/generateOtp";
import { MESSAGES } from "../../../shared/constants/messages";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";

import { ROLES } from "../../../shared/constants/roles";
import { IRegisterTenantUseCase } from "../../interface/tenant/IRegisterTenantUseCase";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";


@injectable()
export class RegisterTenantUseCase implements IRegisterTenantUseCase {
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
            throw new ConflictError(
                MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED
            )
        }

        const hashedPassword = await this._bcryptService.hashPassword(
            input.password
        )

        await this._otpService.storePendingTenantRegistration({
            companyName: input.companyName,
            ownerName: input.ownerName,
            email: input.email,
            phone: input.phone,
            password: hashedPassword,
            role: ROLES.TENANT_ADMIN
        });

        const otp = generateOtp()
        
        await this._otpService.storeOtp({
            email:  input.email,
            otp,
            purpose: OtpPurpose.TENANT_REGISTRATION
        })

        await this._emailService.sendOtp(input.email,otp)

        return {
            // tenant: TenantResponseMapper.toDto(tenant)
            verificationRequired: true,
            email: input.email
        }
    }
}