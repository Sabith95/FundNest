import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/tokens';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
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
import { IRequestPasswordResetOtpUseCase } from '../../interface/auth/IRequestPasswordResetOtpUseCase';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';

@injectable()
export class RequestPasswordResetOtpUseCase implements IRequestPasswordResetOtpUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.EmailService)
    private readonly _emailService: IEmailService,

    @inject(TOKENS.OtpService)
    private readonly _otpService: IOtpService
  ) {}

  async execute(
    input: RequestPasswordResetOtpDto
  ): Promise<RequestPasswordResetOtpResponseDto> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const user = await this._userRepository.findByEmail(normalizedEmail);

    if(!user){
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND)
    }

    if(user.authProvider !== "LOCAL"){
      throw new BadRequestError(MESSAGES.AUTH.GOOGLE_LOGIN)
    }

    if(!user.isActive){
      throw new ForbiddenError(MESSAGES.AUTH.ACCOUNT_INACTIVE)
    }

    

    
      const otp = generateOtp();

      await this._otpService.storeOtp({
        userId: user.id,
        email: user.email,
        otp,
        purpose: OtpPurpose.PASSWORD_RESET
      });

      await this._emailService.sendPasswordResetOtp(user.email, otp);
    

    return {
      email: user.email,
      otpExpiresInSeconds: env.OTP_EXPIRES_IN_SECONDS,
    };
  }
}
