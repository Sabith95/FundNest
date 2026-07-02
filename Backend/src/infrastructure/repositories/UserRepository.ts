import { injectable } from "tsyringe";
import { User } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";
import { CreateUserData, IUserRepository, UpdateUserProfileData } from "../../domain/repositories/IUserRepository";
import { Role } from "../../shared/constants";
import { MongoBaseRepository } from "./MongoBaseRepository";

@injectable()
export class UserRepository extends MongoBaseRepository<User> implements IUserRepository {
  
    constructor(){
      super(UserModel)
    }

    async create(data: CreateUserData): Promise<User> {
        return this.save({
          ...data,
          email:data.email.toLowerCase().trim(),
        }as Partial<User>)
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({
          email: email.toLowerCase().trim()
        }).lean()

        return doc ? this.toEntity(doc): null
    }

    async findByEmailAndRole(email: string, role: Role): Promise<User | null> {
    const doc = await UserModel.findOne({
      email: email.toLowerCase().trim(),
      role,
    }).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const doc = await UserModel.findOne({ googleId }).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { isEmailVerified: true } }
    );
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
      await UserModel.updateOne(
        {_id: userId},
        {$set: {password: hashedPassword}}
      )
  }

  async updateProfile(userId: string, data: UpdateUserProfileData): Promise<User | null> {
      const updateData: Record<string, unknown> =  {}

      if(data.name !== undefined) updateData.name = data.name.trim()
      if(data.email !== undefined) updateData.email = data.email.toLowerCase().trim()
      if(data.phone !== undefined) updateData.phone = data.phone.trim()

      if (data.address) {
        updateData["profile.address"] = {
          line1: data.address.line1?.trim() ?? "",
          line2: data.address.line2?.trim() ?? "",
          city: data.address.city?.trim() ?? "",
          state: data.address.state?.trim() ?? "",
          pincode: data.address.pincode?.trim() ?? "",
          country: data.address.country?.trim() || "India",
        };
      }

      if(Object.keys(updateData).length === 0){
        return this.findById(userId)
      }

      const doc = await UserModel.findByIdAndUpdate(
        userId,
        {$set: updateData},
        {new: true, runValidators: true}
      ).lean()

      return doc ? this.toEntity(doc) : null;
  }

  async updateProfilePhoto(userId: string, avatarUrl: string, avatarPublicId: string): Promise<User | null> {
      const doc = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set:{
            'profile.avatarUrl' : avatarUrl,
            'profile.avatarPublicId' : avatarPublicId,
          },
        },
        {new: true, runValidators: true}
      ).lean()

      return doc ? this.toEntity(doc) : null
  }

  protected toEntity(user: any): User {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      authProvider: user.authProvider,
      googleId: user.googleId,
      isEmailVerified: user.isEmailVerified,
      profile: {
        avatarUrl: user.profile?.avatarUrl,
        avatarPublicId: user.profile?.avatarPublicId,
        address: {
          line1: user.profile?.address?.line1,
          line2: user.profile?.address?.line2,
          city: user.profile?.address?.city,
          state: user.profile?.address?.state,
          pincode: user.profile?.address?.pincode,
          country: user.profile?.address?.country,
        },
        kycStatus: user.profile?.kycStatus || "PENDING",
      },
      role: user.role,
      isActive: user.isActive,
      tenantId: user.tenantId?.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}