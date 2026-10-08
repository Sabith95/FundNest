import { HydratedDocument, model, models, Schema, Types } from "mongoose";
import { MembershipStatus } from "../../../domain/entities/ChitFundMember";

export interface ChitFundMemberDocument {
  fundId: Types.ObjectId | string;
  tenantId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  joinRequestId: Types.ObjectId | string;
  slotNumber: number;
  initialContributionPaise: number;
  joinedAt: Date;
  status: MembershipStatus;
  createdAt: Date;
  updatedAt: Date;
}

const chitFundMemberSchema = new Schema<ChitFundMemberDocument>(
  {
    fundId: {
      type: Schema.Types.ObjectId,
      ref: "ChitFund",
      required: true,
      index: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    joinRequestId: {
      type: Schema.Types.ObjectId,
      ref: "FundJoinRequest",
      required: true,
    },
    slotNumber: {
      type: Number,
      required: true,
    },
    initialContributionPaise: {
      type: Number,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(MembershipStatus),
      default: MembershipStatus.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "chitFundMembers",
  },
);

chitFundMemberSchema.index({ fundId: 1, userId: 1 }, { unique: true });
chitFundMemberSchema.index({ fundId: 1, slotNumber: 1 }, { unique: true });

export type HydratedChitFundMemberDocument =
  HydratedDocument<ChitFundMemberDocument>;

export const ChitFundMemberModel =
  models.ChitFundMember ||
  model<ChitFundMemberDocument>("ChitFundMember", chitFundMemberSchema);
