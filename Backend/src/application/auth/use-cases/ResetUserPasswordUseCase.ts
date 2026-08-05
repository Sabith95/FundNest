import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/tokens';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IBcryptService } from '../../../infrastructure/auth/interfaces/IBcryptService';
import { IOtpService } from '../../../infrastructure/cache/interfaces/IOtpService';
import { MESSAGES } from '../../../shared/constants/messages'
import {
  ResetUserPasswordDto,
  ResetUserPasswordResponseDto,
} from '../dto/PasswordResetDto';
import { IResetUserPasswordUseCase } from '../../interface/auth/IResetUserPasswordUseCase';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class ResetUserPasswordUseCase implements IResetUserPasswordUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.BcryptService)
    private readonly _bcryptService: IBcryptService,

    @inject(TOKENS.OtpService)
    private readonly _otpService: IOtpService
  ) {}

  async execute(input: ResetUserPasswordDto): Promise<ResetUserPasswordResponseDto> {
    if (input.password !== input.confirmPassword) {
      throw new BadRequestError(MESSAGES.AUTH.PASSWORD_MISMATCH);
    }

    const user = await this._userRepository.findByEmail(input.email);

    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }

    if (user.authProvider !== 'LOCAL') {
      throw new BadRequestError(MESSAGES.AUTH.GOOGLE_LOGIN);
    }

    const session = await this._otpService.consumePasswordResetSession(user.email);

    if (session.userId !== user.id) {
      throw new BadRequestError(
        'Password reset session expired. Please verify OTP again.'
      );
    }

    const hashedPassword = await this._bcryptService.hashPassword(input.password);

    await this._userRepository.updatePassword(user.id, hashedPassword);

    return {
      email: user.email,
      passwordReset: true,
    };
  }
}
