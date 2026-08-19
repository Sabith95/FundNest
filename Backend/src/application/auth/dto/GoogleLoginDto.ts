import { AuthUserDto } from "./AuthUserDto"

export interface GoogleLoginDto {
    idToken: string
}

export interface GoogleResponseDto {
    user: AuthUserDto,
    tokens: {
        accessToken: string
        refreshToken: string
    }
} 