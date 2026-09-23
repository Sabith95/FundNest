import { Types } from "mongoose";

import { ChitFund } from "../../../domain/entities/ChitFund";
import { FundType } from "../../../shared/constants/enums/FundType";
import { ChitFundDocument } from "../models/ChitFundModel";

export type ChitFundRecord = ChitFundDocument & {
  _id: Types.ObjectId;
};

export class ChitFundPersistenceMapper {
  static toEntity(fund: ChitFundRecord): ChitFund {
    return ChitFund.create({
      id: fund._id.toString(),
      tenantId: fund.tenantId.toString(),
      name: fund.name,
      description: fund.description,
      fundType: fund.fundType as FundType,
      chitValue: fund.chitValue,
      contributionAmount: fund.contributionAmount,
      durationMonths: fund.durationMonths,
      totalMembers: fund.totalMembers,
      currentMembersCount: fund.currentMembersCount ?? 0,
      startDate: fund.startDate,
      division: fund.division ?? null,
      isActive: fund.isActive,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
    });
  }
}
