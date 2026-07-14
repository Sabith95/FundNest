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
import { OtpPurpose } from '../../../shared/constants/enums/OtpPurpose';

@injectable()
export class VerifyPasswordResetOtpUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.OtpService)
    private readonly _otpService: IOtpService
  ) {}

  async execute(
    input: VerifyPasswordResetOtpDto
  ): Promise<VerifyPasswordResetOtpResponseDto> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const user = await this._userRepository.findByEmail(normalizedEmail);

    if (!user || user.authProvider !== 'LOCAL' || !user.isActive) {
      throw new AppError(MESSAGES.AUTH.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    const verified = await this._otpService.verifyOtp({
      email: user.email,
      otp: input.otp,
      purpose: OtpPurpose.PASSWORD_RESET,
    });

    if (verified.userId !== user.id) {
      throw new AppError(MESSAGES.AUTH.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    await this._otpService.createPasswordResetSession(user.email, user.id);

    return {
      email: user.email,
      verified: true,
    };
  }
}
