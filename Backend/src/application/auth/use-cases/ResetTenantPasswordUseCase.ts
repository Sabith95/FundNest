import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../shared/tokens';
import { ITenantRepository } from '../../../domain/repositories/ITenantRepository';
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
import { IResetTenantPasswordUseCase } from '../../interface/auth/IResetTenantPasswordUseCase';

@injectable()
export class ResetTenantPasswordUseCase implements IResetTenantPasswordUseCase {
    constructor (
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository,

        @inject(TOKENS.BcryptService)
        private readonly _bcryptService: IBcryptService,

        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService
    ) {}

    async execute(input: ResetUserPasswordDto): Promise<ResetUserPasswordResponseDto> {
    if (input.password !== input.confirmPassword) {
      throw new BadRequestError(MESSAGES.AUTH.PASSWORD_MISMATCH);
    }

    const tenant = await this._tenantRepository.findByEmail(input.email);

    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    const session = await this._otpService.consumePasswordResetSession(tenant.email);

    if (session.userId !== tenant.id) {
      throw new BadRequestError(
        'Password reset session expired. Please verify OTP again.'
      );
    }

    const hashedPassword = await this._bcryptService.hashPassword(input.password);

    await this._tenantRepository.updatePassword(tenant.id, hashedPassword);

    return {
      email: tenant.email,
      passwordReset: true,
    };
    }
}