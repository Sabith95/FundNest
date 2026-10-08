import { ChitFundMember } from "../entities/ChitFundMember";
import { PaginatedResult } from "./types/Pagination";

export interface IChitFundMemberRepository {
  create(member: ChitFundMember): Promise<ChitFundMember>;
  findById(id: string): Promise<ChitFundMember | null>;
  findByFundAndUser(fundId: string, userId: string): Promise<ChitFundMember | null>;
  findByFundId(fundId: string): Promise<ChitFundMember[]>;
  countByFundId(fundId: string): Promise<number>;
  findUserMemberships(userId: string): Promise<ChitFundMember[]>;
  findPaginatedForFund(
    fundId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ChitFundMember>>;
}
