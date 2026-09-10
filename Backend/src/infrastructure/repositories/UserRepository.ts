import { injectable } from "tsyringe";
import { User } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";
import {
  CreateUserData,
  IUserRepository,
  UpdateUserProfileData,
} from "../../domain/repositories/IUserRepository";
import { Role } from "../../shared/constants/roles";
import { MongoBaseRepository } from "./MongoBaseRepository";
import {
  UserRecord,
  UserPersistenceMapper,
} from "../database/mapper/UserPersistenceMapper";
import { PaginatedResult } from "../../domain/repositories/types/Pagination";

@injectable()
export class UserRepository
  extends MongoBaseRepository<User>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async create(data: CreateUserData): Promise<User> {
    return this.save({
      ...data,
      email: data.email.toLowerCase().trim(),
    } as Partial<User>);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    }).lean();

    return doc ? this.toEntity(doc) : null;
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
      { $set: { isEmailVerified: true } },
    );
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } },
    );
  }

  async updateActiveStatus(
    userId: string,
    isActive: boolean,
  ): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isActive } },
      { new: true, runValidators: true },
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async updateProfile(
    userId: string,
    data: UpdateUserProfileData,
  ): Promise<User | null> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.email !== undefined)
      updateData.email = data.email.toLowerCase().trim();
    if (data.phone !== undefined) updateData.phone = data.phone.trim();

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

    if (Object.keys(updateData).length === 0) {
      return this.findById(userId);
    }

    const doc = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  async updateProfilePhoto(
    userId: string,
    avatarUrl: string,
    avatarPublicId: string,
  ): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          "profile.avatarUrl": avatarUrl,
          "profile.avatarPublicId": avatarPublicId,
        },
      },
      { new: true, runValidators: true },
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  override async findPaginated(
    page: number,
    limit: number,
    filterOrSearch?: Partial<User> | string,
  ): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * limit;

    let query: any = {};
    if (typeof filterOrSearch === "string" && filterOrSearch.trim() !== "") {
      const regex = new RegExp(filterOrSearch.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    } else if (typeof filterOrSearch === "object" && filterOrSearch !== null) {
      query = filterOrSearch;
    }

    const [docs, total] = await Promise.all([
      UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(query),
    ]);

    return {
      data: docs.map((doc: any) => this.toEntity(doc)),
      total,
      page,
      limit,
    };
  }

  protected toEntity(user: UserRecord): User {
    return UserPersistenceMapper.toEntity(user);
  }
}
