import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/tokens';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IBcryptService } from '../../../infrastructure/auth/interfaces/IBcryptService';
import { IOtpService } from '../../../infrastructure/cache/interfaces/IOtpService';
import { AppError } from '../../../shared/errors/AppError';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus'
import { MESSAGES } from '../../../shared/constants/messages'
import {
  ResetUserPasswordDto,
  ResetUserPasswordResponseDto,
} from '../dto/PasswordResetDto';

@injectable()
export class ResetUserPasswordUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TOKENS.BcryptService)
    private readonly bcryptService: IBcryptService,

    @inject(TOKENS.OtpService)
    private readonly otpService: IOtpService
  ) {}

  async execute(input: ResetUserPasswordDto): Promise<ResetUserPasswordResponseDto> {
    if (input.password !== input.confirmPassword) {
      throw new AppError(MESSAGES.AUTH.PASSWORD_MISMATCH, HTTP_STATUS.BAD_REQUEST);
    }

    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (user.authProvider !== 'LOCAL') {
      throw new AppError(MESSAGES.AUTH.GOOGLE_LOGIN, HTTP_STATUS.BAD_REQUEST);
    }

    const session = await this.otpService.consumePasswordResetSession(user.email);

    if (session.userId !== user.id) {
      throw new AppError(
        'Password reset session expired. Please verify OTP again.',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedPassword = await this.bcryptService.hashPassword(input.password);

    await this.userRepository.updatePassword(user.id, hashedPassword);

    return {
      email: user.email,
      passwordReset: true,
    };
  }
}
