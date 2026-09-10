import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { IEmailService } from "../../../infrastructure/notification/interfaces/IEmailService";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { generateOtp } from "../../../shared/utils/generateOtp";
import { MESSAGES } from "../../../shared/constants/messages";
import { ResendOtpDto, ResendOtpResponseDto } from "../dto/resendOtpDto";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { env } from "../../../infrastructure/config/env";
import { IResendTenantOtpUseCase } from "../../interface/tenant/IResendTenantOtpUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";

@injectable()
export class ResendTenantOtpUseCase implements IResendTenantOtpUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
    @inject(TOKENS.EmailService)
    private readonly _emailService: IEmailService,
    @inject(TOKENS.OtpService)
    private readonly _otpService: IOtpService,
  ) {}

  async execute(input: ResendOtpDto): Promise<ResendOtpResponseDto> {
    const tenant = await this._tenantRepository.findByEmail(input.email);

    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    if (tenant.isEmailVerified) {
      throw new BadRequestError(MESSAGES.AUTH.EMAIL_VERIFIED);
    }

    const otp = generateOtp();

    await this._otpService.storeOtp({
      userId: tenant.id,
      email: tenant.email,
      otp,
      purpose: OtpPurpose.TENANT_REGISTRATION,
    });

    await this._emailService.sendOtp(tenant.email, otp);
    return {
      email: tenant.email,
      otpExpiresInSeconds: env.OTP_EXPIRES_IN_SECONDS,
    };
  }
}
