export interface RegisterUserDto {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string
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
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    isActive: boolean;
    tenantId?: string;
    isEmailVerified: boolean
    profile: {
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
      };
      kycStatus: string;
    };
  };
  verificationRequired: boolean
}