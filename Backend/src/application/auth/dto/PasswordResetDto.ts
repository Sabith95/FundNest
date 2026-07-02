export interface RequestPasswordResetOtpDto {
  email: string;
}

export interface RequestPasswordResetOtpResponseDto {
  email: string;
  otpExpiresInSeconds: number;
}

export interface VerifyPasswordResetOtpDto {
  email: string;
  otp: string;
}

export interface VerifyPasswordResetOtpResponseDto {
  email: string;
  verified: boolean;
}

export interface ResetUserPasswordDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetUserPasswordResponseDto {
  email: string;
  passwordReset: boolean;
}
