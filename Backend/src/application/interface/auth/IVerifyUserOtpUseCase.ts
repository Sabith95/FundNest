import { verifyOtpDto } from "../../auth/dto/verifyOtpDto";
import { verifyOtpResponseDto } from "../../auth/dto/verifyOtpDto";

export interface IVerifyUserOtpUseCase {
  execute(input: verifyOtpDto): Promise<verifyOtpResponseDto>;
}
