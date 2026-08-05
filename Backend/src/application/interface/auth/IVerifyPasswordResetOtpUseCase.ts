import { VerifyPasswordResetOtpDto } from "../../auth/dto/PasswordResetDto";
import { VerifyPasswordResetOtpResponseDto } from "../../auth/dto/PasswordResetDto";

export interface IVerifyPasswordResetOtpUseCase {
    execute(input: VerifyPasswordResetOtpDto): Promise<VerifyPasswordResetOtpResponseDto>
}