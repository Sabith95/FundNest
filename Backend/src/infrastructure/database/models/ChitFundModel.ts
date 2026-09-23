import { HydratedDocument, model, models, Schema, Types } from "mongoose";

import { FundType } from "../../../shared/constants/enums/FundType";

export interface ChitFundDocument {
  tenantId: Types.ObjectId | string;
  name: string;
  description?: string;
  fundType: FundType;
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  currentMembersCount: number;
  startDate: Date;
  division: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chitFundSchema = new Schema<ChitFundDocument>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fundType: {
      type: String,
      enum: Object.values(FundType),
      required: true,
      index: true,
    },
    chitValue: {
      type: Number,
      required: true,
      min: 1,
    },
    contributionAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    durationMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    totalMembers: {
      type: Number,
      required: true,
      min: 1,
    },
    currentMembersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    division: {
      type: Number,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "chitFunds",
  },
);

chitFundSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export type HydratedChitFundDocument = HydratedDocument<ChitFundDocument>;

export const ChitFundModel =
  models.ChitFund || model<ChitFundDocument>("ChitFund", chitFundSchema);
