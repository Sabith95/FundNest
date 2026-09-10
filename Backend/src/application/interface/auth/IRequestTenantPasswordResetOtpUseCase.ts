import { RequestPasswordResetOtpDto } from "../../auth/dto/PasswordResetDto";
import { RequestPasswordResetOtpResponseDto } from "../../auth/dto/PasswordResetDto";

export interface IRequestTenantPasswordResetOtpUseCase {
  execute(
    input: RequestPasswordResetOtpDto,
  ): Promise<RequestPasswordResetOtpResponseDto>;
}
