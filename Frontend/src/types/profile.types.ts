export interface IAddressFormValues {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: IAddressFormValues;
}

export interface IProfileFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface IPasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IPasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface IUserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: IAddressFormValues;
  role: string;
  isVerified: boolean;
  avatarUrl?: string;
  lastUpdated: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  authProvider: 'LOCAL' | 'GOOGLE';
}

export interface IAddressDto {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface IUserProfileApiDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  authProvider: 'LOCAL' | 'GOOGLE';
  isActive: boolean;
  isEmailVerified: boolean;
  profile: {
    avatarUrl?: string;
    address?: IAddressDto;
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  };
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: IAddressDto;
}

export interface IUpdateProfileResponse {
  user: IUserProfileApiDto;
  emailChanged: boolean;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordResponse {
  passwordChanged: boolean;
}

export const EMPTY_ADDRESS: IAddressFormValues = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
};
