export interface GoogleLoginDto {
    idToken: string
}

export interface GoogleResponseDto {
    user:{
        id: string
        name: string
        email: string
        role: string
    }
    tokens: {
        accessToken: string
        refreshToken: string
    }
} 