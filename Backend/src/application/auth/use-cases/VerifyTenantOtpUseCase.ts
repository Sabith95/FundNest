import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { verifyOtpDto, verifyOtpResponseDto } from "../dto/verifyOtpDto";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";

@injectable()
export class VerifyTenantOtpUseCase {
    constructor (
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository,
        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService
    ){}
    

    async execute(input: verifyOtpDto): Promise<verifyOtpResponseDto> {
        const verifiedOtp = await this._otpService.verifyOtp({
            email: input.email,
            otp: input.otp,
            purpose: OtpPurpose.TENANT_REGISTRATION
        })

        await this._tenantRepository.markEmailAsVerified(verifiedOtp.userId)

        return {
            email: verifiedOtp.email,
            isEmailVerified: true
        }
    }

}