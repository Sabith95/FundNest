import { Role } from "../../shared/constants";

export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'
export type AuthProvider = 'LOCAL' | 'GOOGLE'


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