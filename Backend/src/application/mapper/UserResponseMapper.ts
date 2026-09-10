import { User } from "../../domain/entities/User";
import { AuthUserDto } from "../auth/dto/AuthUserDto";
import { UserDto } from "../auth/dto/UserDto";
import { UserProfileDto } from "../user/dto/ProfileDto";

export class UserResponseMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      profile: user.profile,
    };
  }

  static toAuthUserDto(user: User): AuthUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static toUserProfileDto(user: User): UserProfileDto {
    return {
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
    };
  }
}
