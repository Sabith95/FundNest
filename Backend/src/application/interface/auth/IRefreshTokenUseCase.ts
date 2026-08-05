import { RefreshTokenResponseDto } from "../../auth/dto/RefreshTokenDto";

export interface IRefreshTokenUseCase {
    execute(refreshToken: string): Promise<RefreshTokenResponseDto>
}