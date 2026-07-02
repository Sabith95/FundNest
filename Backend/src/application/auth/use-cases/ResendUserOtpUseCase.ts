import { inject, injectable } from "tsyringe";
import { TOKENS } from '../../../shared/tokens';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IEmailService } from '../../../infrastructure/notification/interfaces/IEmailService';
import { IOtpService } from '../../../infrastructure/cache/interfaces/IOtpService';
import { generateOtp } from '../../../shared/utils/generateOtp';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus'
import { MESSAGES } from '../../../shared/constants/messages'
import { env } from '../../../config/env';
import { ResendOtpDto, ResendOtpResponseDto } from '../dto/resendOtpDto';


@injectable()
export class ResendUserOtpUseCase {
    constructor(
        @inject(TOKENS.UserRepository)
        private readonly userRepository: IUserRepository,

        @inject(TOKENS.EmailService)
        private readonly emailService: IEmailService,

        @inject(TOKENS.OtpService)
        private readonly otpService: IOtpService
    ){}

    async execute(input: ResendOtpDto): Promise<ResendOtpResponseDto> {
        const user = await this.userRepository.findByEmail(input.email)

        if(!user){
            throw new AppError(MESSAGES.USER.NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }

        
        if (user.isEmailVerified) {
        throw new AppError(MESSAGES.AUTH.EMAIL_VERIFIED, HTTP_STATUS.BAD_REQUEST);
        }

        if (user.authProvider !== 'LOCAL') {
        throw new AppError(MESSAGES.AUTH.GOOGLE_LOGIN, HTTP_STATUS.BAD_REQUEST);
        }
        
        const otp = generateOtp()

        await this.otpService.storeOtp({
            userId: user.id,
            email: user.email,
            otp,
            purpose: "USER_REGISTRATION"
        })

        await this.emailService.sendOtp(user.email,otp)

        return {
            email: user.email,
            otpExpiresInSeconds: env.OTP_EXPIRES_IN_SECONDS,
        }
    }
}
