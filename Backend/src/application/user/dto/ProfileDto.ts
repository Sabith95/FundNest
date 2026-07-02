import { User } from "../../../domain/entities/User";
import { Role } from "../../../shared/constants";

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

export const toUserProfileDto = (user: User): UserProfileDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  authProvider: user.authProvider,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  profile: {
    avatarUrl: user.profile?.avatarUrl,
    address: user.profile?.address,
    kycStatus: user.profile?.kycStatus ?? "PENDING",
  },
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});