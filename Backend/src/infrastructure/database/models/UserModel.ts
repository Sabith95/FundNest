import { Schema, model, models, HydratedDocument } from "mongoose";
import { ROLES, Role } from "../../../shared/constants/roles";

export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type AuthProvider = "LOCAL" | "GOOGLE";

export interface UserProfileDocument {
  avatarUrl?: string;
  avatarPublicId?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  kycStatus: KycStatus;
}

export interface UserDocument {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  authProvider: AuthProvider
  googleId?: string
  role: Role;
  isActive: boolean;
  isEmailVerified:boolean,
  tenantId?: Schema.Types.ObjectId;
  profile: UserProfileDocument
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: function (this: UserDocument){
        return this.authProvider === 'LOCAL'
      },
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ['LOCAL', "GOOGLE"],
      default: "LOCAL",
      required: true
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
      index: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: false,
      index: true,
    },
    profile:{
      avatarUrl: {
        type: String,
        trim: true,
      },
      avatarPublicId: {
        type: String,
        trim: true,
      },
      address: {
          line1: { type: String, trim: true },
          line2: { type: String, trim: true },
          city: { type: String, trim: true },
          state: { type: String, trim: true },
          pincode: { type: String, trim: true },
          country: { type: String, trim: true, default: "India" },
    },
    kycStatus: {
    type: String,
    enum: ["PENDING", "VERIFIED", "REJECTED"],
    default: "PENDING",
      },
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export type HydratedUserDocument = HydratedDocument<UserDocument>;

export const UserModel =
  models.User || model<UserDocument>("User", userSchema);
