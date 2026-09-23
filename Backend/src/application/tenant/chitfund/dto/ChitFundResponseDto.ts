import { FundType } from "../../../../shared/constants/enums/FundType";

export interface ChitFundResponseDto {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  fundType: FundType;
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  currentMembersCount: number;
  startDate: string;
  division: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
