import { ResendOtpDto } from "../../auth/dto/resendOtpDto";
import { ResendOtpResponseDto } from "../../auth/dto/resendOtpDto";

export interface IResendUserOtpUseCase {
    execute(input: ResendOtpDto): Promise<ResendOtpResponseDto>
}