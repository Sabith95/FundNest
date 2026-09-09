import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { IEmailService } from '../../../infrastructure/notification/interfaces/IEmailService';
import { IOtpService } from '../../../infrastructure/cache/interfaces/IOtpService';
import { generateOtp } from '../../../shared/utils/generateOtp';
import { env } from '../../../infrastructure/config/env';
import {
  RequestPasswordResetOtpDto,
  RequestPasswordResetOtpResponseDto,
} from '../dto/PasswordResetDto';
import { MESSAGES } from '../../../shared/constants/messages'
import { OtpPurpose } from '../../../shared/constants/enums/OtpPurpose';
import { IRequestTenantPasswordResetOtpUseCase } from "../../interface/auth/IRequestTenantPasswordResetOtpUseCase";
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';

@injectable()
export class RequestTenantPasswordResetOtpUseCase implements IRequestTenantPasswordResetOtpUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository,
        @inject(TOKENS.EmailService)
        private readonly _emailService: IEmailService,
        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService
    ) {}

    async execute(input: RequestPasswordResetOtpDto): Promise<RequestPasswordResetOtpResponseDto> {
        const normalizedEmail = input.email.toLocaleLowerCase().trim()
        const tenant = await this._tenantRepository.findById(normalizedEmail)

        if(!tenant){
            throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND)
        }

        if(!tenant.isActive){
            throw new ForbiddenError(MESSAGES.AUTH.ACCOUNT_INACTIVE)
        }

        const otp = generateOtp()

        await this._otpService.storeOtp({
            userId: tenant.id,
            email: tenant.email,
            otp,
            purpose: OtpPurpose.TENANT_FORGOT_PASSWORD
        })

        await this._emailService.sendPasswordResetOtp(tenant.email, otp)

        return {
            email: tenant.email,
            otpExpiresInSeconds: env.OTP_EXPIRES_IN_SECONDS
        }
    }
}