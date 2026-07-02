import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/tokens';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOtpService } from '../../../infrastructure/cache/interfaces/IOtpService';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus'
import { MESSAGES } from '../../../shared/constants/messages'
import {
  VerifyPasswordResetOtpDto,
  VerifyPasswordResetOtpResponseDto,
} from '../dto/PasswordResetDto';

@injectable()
export class VerifyPasswordResetOtpUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TOKENS.OtpService)
    private readonly otpService: IOtpService
  ) {}

  async execute(
    input: VerifyPasswordResetOtpDto
  ): Promise<VerifyPasswordResetOtpResponseDto> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user || user.authProvider !== 'LOCAL' || !user.isActive) {
      throw new AppError(MESSAGES.AUTH.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    const verified = await this.otpService.verifyOtp({
      email: user.email,
      otp: input.otp,
      purpose: 'PASSWORD_RESET',
    });

    if (verified.userId !== user.id) {
      throw new AppError(MESSAGES.AUTH.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    await this.otpService.createPasswordResetSession(user.email, user.id);

    return {
      email: user.email,
      verified: true,
    };
  }
}
