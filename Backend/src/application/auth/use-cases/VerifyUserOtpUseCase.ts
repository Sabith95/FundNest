import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { verifyOtpDto, verifyOtpResponseDto } from "../dto/verifyOtpDto";

@injectable()
export class VerifyUserOtpUseCase {
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
            purpose: "USER_REGISTRATION",
        })

        await this._userRepository.markEmailAsVerified(verifiedOtp.userId)

        return {
            email: verifiedOtp.email,
            isEmailVerified: true
        }
    }

}