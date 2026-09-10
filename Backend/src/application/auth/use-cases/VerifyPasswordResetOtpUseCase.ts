import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { MESSAGES } from "../../../shared/constants/messages";
import {
  VerifyPasswordResetOtpDto,
  VerifyPasswordResetOtpResponseDto,
} from "../dto/PasswordResetDto";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { IVerifyPasswordResetOtpUseCase } from "../../interface/auth/IVerifyPasswordResetOtpUseCase";
import { BadRequestError } from "../../../shared/errors/BadRequestError";

@injectable()
export class VerifyPasswordResetOtpUseCase implements IVerifyPasswordResetOtpUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.OtpService)
    private readonly _otpService: IOtpService,
  ) {}

  async execute(
    input: VerifyPasswordResetOtpDto,
  ): Promise<VerifyPasswordResetOtpResponseDto> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const user = await this._userRepository.findByEmail(normalizedEmail);

    if (!user || user.authProvider !== "LOCAL" || !user.isActive) {
      throw new BadRequestError(MESSAGES.AUTH.INVALID_OTP);
    }

    const verified = await this._otpService.verifyOtp({
      email: user.email,
      otp: input.otp,
      purpose: OtpPurpose.PASSWORD_RESET,
    });

    if (verified.userId !== user.id) {
      throw new BadRequestError(MESSAGES.AUTH.INVALID_OTP);
    }

    await this._otpService.createPasswordResetSession(user.email, user.id);

    return {
      email: user.email,
      verified: true,
    };
  }
}
