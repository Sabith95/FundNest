import { ResetUserPasswordDto } from "../../auth/dto/PasswordResetDto";
import { ResetUserPasswordResponseDto } from "../../auth/dto/PasswordResetDto";

export interface IResetTenantPasswordUseCase {
    execute(input: ResetUserPasswordDto): Promise<ResetUserPasswordResponseDto>
}