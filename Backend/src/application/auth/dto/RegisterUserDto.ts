export interface RegisterUserDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
}

export interface RegisterUserResponseDto {
  verificationRequired: boolean;
}
