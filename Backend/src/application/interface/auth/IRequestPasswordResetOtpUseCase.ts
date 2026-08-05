import { RequestPasswordResetOtpDto } from "../../auth/dto/PasswordResetDto";
import { RequestPasswordResetOtpResponseDto } from "../../auth/dto/PasswordResetDto";

export interface IRequestPasswordResetOtpUseCase {
    execute(input: RequestPasswordResetOtpDto): Promise<RequestPasswordResetOtpResponseDto>
}