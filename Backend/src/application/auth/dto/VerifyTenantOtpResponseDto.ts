export interface VerifyTenantOtpResponseDto {
    email: string;
    isEmailVerified: boolean;
    accessToken: string;
    refreshToken: string;
}
