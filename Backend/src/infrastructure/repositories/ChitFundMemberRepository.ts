import { injectable } from "tsyringe";
import { ChitFundMember } from "../../domain/entities/ChitFundMember";
import { IChitFundMemberRepository } from "../../domain/repositories/IChitFundMemberRepository";
import { PaginatedResult } from "../../domain/repositories/types/Pagination";
import {
  ChitFundMemberModel,
  ChitFundMemberDocument,
} from "../database/models/ChitFundMemberModel";
import {
  ChitFundMemberPersistenceMapper,
  ChitFundMemberRecord,
} from "../database/mapper/ChitFundMemberPersistenceMapper";
import { MongoBaseRepository } from "./MongoBaseRepository";

@injectable()
export class ChitFundMemberRepository
  extends MongoBaseRepository<ChitFundMember>
  implements IChitFundMemberRepository
{
  constructor() {
    super(ChitFundMemberModel);
  }

  async create(member: ChitFundMember): Promise<ChitFundMember> {
    const data = ChitFundMemberPersistenceMapper.toPersistence(member);
    const created = await this.model.create(data);
    return this.toEntity(created.toObject() as ChitFundMemberRecord);
  }

  async findByFundAndUser(
    fundId: string,
    userId: string,
  ): Promise<ChitFundMember | null> {
    const doc = await this.model
      .findOne({ fundId, userId })
      .lean<ChitFundMemberRecord>();
    return doc ? this.toEntity(doc) : null;
  }

  async findByFundId(fundId: string): Promise<ChitFundMember[]> {
    const docs = await this.model
      .find({ fundId })
      .sort({ slotNumber: 1 })
      .lean<ChitFundMemberRecord[]>();
    return docs.map((doc) => this.toEntity(doc));
  }

  async countByFundId(fundId: string): Promise<number> {
    return this.model.countDocuments({ fundId });
  }

  async findUserMemberships(userId: string): Promise<ChitFundMember[]> {
    const docs = await this.model
      .find({ userId })
      .populate("fundId")
      .sort({ joinedAt: -1 })
      .lean<ChitFundMemberRecord[]>();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findPaginatedForFund(
    fundId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ChitFundMember>> {
    const query = { fundId };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find(query)
        .populate("userId", "name email phone profile")
        .sort({ slotNumber: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query),
    ]);

    const entities = items.map((doc: any) => {
      const entity = this.toEntity(doc);
      (entity as any).memberDetails = doc.userId;
      return entity;
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: entities,
      total,
      page,
      limit,
    };
  }

  protected toEntity(doc: ChitFundMemberRecord): ChitFundMember {
    return ChitFundMemberPersistenceMapper.toEntity(doc);
  }
}
