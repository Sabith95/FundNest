import { Types } from "mongoose";
import { ChitFundMember } from "../../../domain/entities/ChitFundMember";
import { ChitFundMemberDocument } from "../models/ChitFundMemberModel";

export type ChitFundMemberRecord = ChitFundMemberDocument & {
  _id: Types.ObjectId;
};

export class ChitFundMemberPersistenceMapper {
  static toEntity(doc: ChitFundMemberRecord): ChitFundMember {
    return ChitFundMember.create({
      id: doc._id.toString(),
      fundId: doc.fundId.toString(),
      tenantId: doc.tenantId.toString(),
      userId: doc.userId.toString(),
      joinRequestId: doc.joinRequestId.toString(),
      slotNumber: doc.slotNumber,
      initialContributionPaise: doc.initialContributionPaise,
      joinedAt: doc.joinedAt,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: ChitFundMember): Partial<ChitFundMemberDocument> {
    return {
      fundId: new Types.ObjectId(entity.fundId),
      tenantId: new Types.ObjectId(entity.tenantId),
      userId: new Types.ObjectId(entity.userId),
      joinRequestId: new Types.ObjectId(entity.joinRequestId),
      slotNumber: entity.slotNumber,
      initialContributionPaise: entity.initialContributionPaise,
      joinedAt: entity.joinedAt,
      status: entity.status,
    };
  }
}
