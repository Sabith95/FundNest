import { RegisterUserDto } from "../../auth/dto/RegisterUserDto";
import { RegisterUserResponseDto } from "../../auth/dto/RegisterUserDto";

export interface IRegisterUserUseCase {
    execute(input: RegisterUserDto): Promise<RegisterUserResponseDto>
}