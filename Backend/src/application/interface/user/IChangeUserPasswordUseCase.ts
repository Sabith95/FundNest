import { ChangePasswordDto } from "../../user/dto/ProfileDto";
import { ChangePasswordResponseDto } from "../../user/dto/ProfileDto";

export interface IChangeUserPasswordUseCase {
    execute(input: ChangePasswordDto): Promise<ChangePasswordResponseDto>
}