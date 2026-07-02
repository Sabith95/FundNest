export interface ResendOtpDto{
    email: string
}

export interface ResendOtpResponseDto {
    email: string
    otpExpiresInSeconds: number
}