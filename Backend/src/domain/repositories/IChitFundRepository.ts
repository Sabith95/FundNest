import { ChitFund } from "../entities/ChitFund";
import { FundType } from "../../shared/constants/enums/FundType";
import { IBaseRepository } from "./IBaseRepository";

export interface CreateChitFundData {
  tenantId: string;
  name: string;
  description?: string;
  fundType: FundType;
  chitValue: number;
  contributionAmount: number;
  durationMonths: number;
  totalMembers: number;
  currentMembersCount?: number;
  startDate: Date;
  division?: number | null;
  isActive?: boolean;
}

export interface IChitFundRepository extends IBaseRepository<ChitFund> {
  createFund(data: CreateChitFundData): Promise<ChitFund>;
  findByTenantId(tenantId: string): Promise<ChitFund[]>;
  findByIdAndTenantId(id: string, tenantId: string): Promise<ChitFund | null>;
  findByNameAndTenantId(name: string, tenantId: string): Promise<ChitFund | null>;
  updateStatus(id: string, tenantId: string, isActive: boolean): Promise<ChitFund | null>;
}
