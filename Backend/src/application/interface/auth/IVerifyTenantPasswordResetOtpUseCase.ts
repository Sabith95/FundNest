import { VerifyPasswordResetOtpDto } from "../../auth/dto/PasswordResetDto";
import { VerifyPasswordResetOtpResponseDto } from "../../auth/dto/PasswordResetDto";

export interface IVerifyTenantPasswordResetOtpUseCase {
  execute(
    input: VerifyPasswordResetOtpDto,
  ): Promise<VerifyPasswordResetOtpResponseDto>;
}
