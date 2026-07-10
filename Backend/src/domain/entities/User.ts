import { Role } from "../../shared/constants/roles";

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}

export enum KycStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}


export interface UserProfile {
  avatarUrl?: string
  avatarPublicId?: string
  address?:{
    line1?: string
    line2?: string
    city?: string
    state?: string
    pincode?: string
    country?: string
  }
  kycStatus: KycStatus
}


export interface User {
  id: string
  name: string
  email: string
  phone?: string
  password?: string
  googleId?: string
  role: Role
  authProvider: AuthProvider
  isActive: boolean
  isEmailVerified: boolean
  tenantId?: string
  profile: UserProfile
  createdAt: Date
  updatedAt: Date
  
}