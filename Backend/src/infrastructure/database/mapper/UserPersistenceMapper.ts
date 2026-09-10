import { Types } from "mongoose";
import { AuthProvider, KycStatus, User } from "../../../domain/entities/User";
import { UserDocument } from "../models/UserModel";

export type UserRecord = UserDocument & { _id: Types.ObjectId };

export class UserPersistenceMapper {
  static toEntity(user: UserRecord): User {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      googleId: user.googleId,
      role: user.role,
      authProvider: user.authProvider as AuthProvider,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      tenantId: user.tenantId?.toString(),
      profile: {
        avatarUrl: user.profile?.avatarUrl,
        avatarPublicId: user.profile?.avatarPublicId,
        address: user.profile?.address,
        kycStatus: (user.profile?.kycStatus ?? KycStatus.PENDING) as KycStatus,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
