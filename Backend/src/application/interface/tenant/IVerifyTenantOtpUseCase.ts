import { verifyOtpDto } from "../../auth/dto/verifyOtpDto";
import { VerifyTenantOtpResponseDto } from "../../auth/dto/VerifyTenantOtpResponseDto";

export interface IVerifyTenantOtpUseCase {
    execute(input: verifyOtpDto): Promise<VerifyTenantOtpResponseDto>
}