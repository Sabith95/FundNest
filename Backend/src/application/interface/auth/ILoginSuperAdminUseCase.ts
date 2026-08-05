import { LoginDto } from "../../auth/dto/LoginDto";
import { LoginResponseDto } from "../../auth/dto/LoginDto";

export interface ILoginSuperAdminUseCase {
    execute(input: LoginDto) : Promise<LoginResponseDto>
}