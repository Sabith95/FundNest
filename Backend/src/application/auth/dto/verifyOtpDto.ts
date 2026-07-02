export interface verifyOtpDto {
    email: string
    otp: string
}

export interface verifyOtpResponseDto {
    email: string
    isEmailVerified: boolean
}