import { Role } from "../../shared/constants/roles";
import { User } from "../entities/User";
import { IBaseRepository } from "./IBaseRepository";

export interface CreateUserData {
  name: string
  email: string
  phone?: string;
  password?: string;
  role: Role;
  authProvider: "LOCAL" | "GOOGLE";
  googleId?: string;
  isActive?: boolean;
  tenantId?: string;
  isEmailVerified: boolean;
  profile?: {
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
    kycStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  };
}

export interface UserAddressData {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: UserAddressData;
}



export interface IUserRepository extends IBaseRepository<User> {
  create(data: CreateUserData): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findByEmailAndRole(email: string, role: Role): Promise<User | null>
  findByGoogleId(googleId: string): Promise<User | null>
  markEmailAsVerified(userId: string): Promise<void>
  updatePassword(userId: string, hashedPassword: string): Promise<void>
  updateProfile(userId: string, data: UpdateUserProfileData): Promise<User | null>
  updateProfilePhoto(userId: string, avatarUrl: string, avatarPublicId: string): Promise<User | null>
}

