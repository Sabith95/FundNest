import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { verifyOtpDto } from "../dto/verifyOtpDto";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { ROLES } from "../../../shared/constants/roles";

export interface VerifyTenantOtpResponseDto {
    email: string;
    isEmailVerified: boolean;
    accessToken: string;
    refreshToken: string;
}

@injectable()
export class VerifyTenantOtpUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository,
        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService,
        @inject(TOKENS.JwtService)
        private readonly _jwtService: IJwtService
    ) { }


    async execute(input: verifyOtpDto): Promise<VerifyTenantOtpResponseDto> {
        const verifiedOtp = await this._otpService.verifyOtp({
            email: input.email,
            otp: input.otp,
            purpose: OtpPurpose.TENANT_REGISTRATION
        })

        const tenant = await this._tenantRepository.markEmailAsVerified(verifiedOtp.userId)

        const tokens = this._jwtService.generateTokenPair({
            id: verifiedOtp.userId,
            email: verifiedOtp.email,
            role: ROLES.TENANT_ADMIN,
        })

        return {
            email: verifiedOtp.email,
            isEmailVerified: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }
    }

}