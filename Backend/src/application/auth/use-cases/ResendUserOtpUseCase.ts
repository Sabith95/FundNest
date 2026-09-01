import { inject, injectable } from "tsyringe";
import { TOKENS } from '../../../shared/tokens';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IEmailService } from '../../../infrastructure/notification/interfaces/IEmailService';
import { IOtpService } from '../../../infrastructure/cache/interfaces/IOtpService';
import { generateOtp } from '../../../shared/utils/generateOtp';
import { MESSAGES } from '../../../shared/constants/messages'
import { env } from '../../../infrastructure/config/env';
import { ResendOtpDto, ResendOtpResponseDto } from '../dto/resendOtpDto';
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { IResendUserOtpUseCase } from "../../interface/auth/IResendUserOtpUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";

@injectable()
export class ResendUserOtpUseCase implements IResendUserOtpUseCase {
    constructor(
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository,

        @inject(TOKENS.EmailService)
        private readonly _emailService: IEmailService,

        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService
    ){}

    async execute(input: ResendOtpDto): Promise<ResendOtpResponseDto> {
        const user = await this._userRepository.findByEmail(input.email)

        if(!user){
            throw new NotFoundError(MESSAGES.USER.NOT_FOUND)
        }

        
        if (user.isEmailVerified) {
        throw new BadRequestError(MESSAGES.AUTH.EMAIL_VERIFIED);
        }

        if (user.authProvider !== 'LOCAL') {
        throw new BadRequestError(MESSAGES.AUTH.GOOGLE_LOGIN);
        }
        
        const otp = generateOtp()

        await this._otpService.storeOtp({
            userId: user.id,
            email: user.email,
            otp,
            purpose: OtpPurpose.USER_REGISTRATION
        })

        await this._emailService.sendOtp(user.email,otp)

        return {
            email: user.email,
            otpExpiresInSeconds: env.OTP_EXPIRES_IN_SECONDS,
        }
    }
}
