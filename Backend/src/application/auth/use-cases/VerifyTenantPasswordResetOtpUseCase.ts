import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { IOtpService } from "../../../domain/interface/otp/IOtpService";
import { IPasswordResetSessionService } from "../../../domain/interface/auth/IPasswordResetSessionService";
import { MESSAGES } from "../../../shared/constants/messages";
import {
  VerifyPasswordResetOtpDto,
  VerifyPasswordResetOtpResponseDto,
} from "../dto/PasswordResetDto";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { IVerifyTenantPasswordResetOtpUseCase } from "../../interface/auth/IVerifyTenantPasswordResetOtpUseCase";
import { BadRequestError } from "../../../shared/errors/BadRequestError";

@injectable()
export class VerifyTenantPasswordResetOtpUseCase implements IVerifyTenantPasswordResetOtpUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,

    @inject(TOKENS.OtpService)
    private readonly _otpService: IOtpService,
    @inject(TOKENS.PasswordResetSessionService)
    private readonly _passwordResetSessionService: IPasswordResetSessionService,
  ) {}

  async execute(
    input: VerifyPasswordResetOtpDto,
  ): Promise<VerifyPasswordResetOtpResponseDto> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const tenant = await this._tenantRepository.findByEmail(normalizedEmail);

    if (!tenant || !tenant.isActive) {
      throw new BadRequestError(MESSAGES.AUTH.INVALID_OTP);
    }

    const verified = await this._otpService.verifyOtp({
      email: tenant.email,
      otp: input.otp,
      purpose: OtpPurpose.TENANT_FORGOT_PASSWORD,
    });

    if (verified.userId !== tenant.id) {
      throw new BadRequestError(MESSAGES.AUTH.INVALID_OTP);
    }

    await this._passwordResetSessionService.createPasswordResetSession(
      tenant.email,
      tenant.id,
    );

    return {
      email: tenant.email,
      verified: true,
    };
  }
}
