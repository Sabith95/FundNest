import { User } from "../../../domain/entities/User";
import { Role } from "../../../shared/constants/roles";

export interface AddressDto {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface UserProfileDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  authProvider: "LOCAL" | "GOOGLE";
  isActive: boolean;
  isEmailVerified: boolean;
  profile: {
    avatarUrl?: string;
    address?: AddressDto;
    kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileDto {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: AddressDto;
}

export interface UpdateProfileResponseDto {
  user: UserProfileDto;
  emailChanged: boolean;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface UpdateProfilePhotoDto {
  userId: string;
  file: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
  };
}

export interface ChangePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponseDto {
  passwordChanged: boolean;
}

