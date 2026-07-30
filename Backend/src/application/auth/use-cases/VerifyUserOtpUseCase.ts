import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { verifyOtpDto, verifyOtpResponseDto } from "../dto/verifyOtpDto";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { IVerifyUserOtpUseCase } from "../../interface/auth/IVerifyUserOtpUseCase";

@injectable()
export class VerifyUserOtpUseCase implements IVerifyUserOtpUseCase {
    constructor (
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService
    ){}
    

    async execute(input: verifyOtpDto): Promise<verifyOtpResponseDto> {
        const verifiedOtp = await this._otpService.verifyOtp({
            email: input.email,
            otp: input.otp,
            purpose: OtpPurpose.USER_REGISTRATION
        })

        await this._userRepository.markEmailAsVerified(verifiedOtp.userId)

        return {
            email: verifiedOtp.email,
            isEmailVerified: true
        }
    }

}