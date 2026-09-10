import { ResetUserPasswordDto } from "../../auth/dto/PasswordResetDto";
import { ResetUserPasswordResponseDto } from "../../auth/dto/PasswordResetDto";

export interface IResetUserPasswordUseCase {
  execute(input: ResetUserPasswordDto): Promise<ResetUserPasswordResponseDto>;
}
