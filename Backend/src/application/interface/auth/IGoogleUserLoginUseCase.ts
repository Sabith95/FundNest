import { GoogleLoginDto } from "../../auth/dto/GoogleLoginDto";
import { GoogleResponseDto } from "../../auth/dto/GoogleLoginDto";

export interface IGoogleUserLoginUseCase {
    execute(input: GoogleLoginDto): Promise<GoogleResponseDto>
}