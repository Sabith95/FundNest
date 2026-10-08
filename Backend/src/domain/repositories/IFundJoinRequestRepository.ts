import { FundJoinRequest } from "../entities/FundJoinRequest";
import { PaginatedResult } from "./types/Pagination";

export interface FindTenantJoinRequestsFilter {
  fundId?: string;
  status?: string;
  search?: string;
}

export interface IFundJoinRequestRepository {
  create(request: FundJoinRequest): Promise<FundJoinRequest>;
  findById(id: string): Promise<FundJoinRequest | null>;
  findByFundAndUser(fundId: string, userId: string): Promise<FundJoinRequest | null>;
  findByOrderId(orderId: string): Promise<FundJoinRequest | null>;
  updateRequest(request: FundJoinRequest): Promise<FundJoinRequest>;
  findPaginatedForTenant(
    tenantId: string,
    page: number,
    limit: number,
    filter?: FindTenantJoinRequestsFilter,
  ): Promise<PaginatedResult<FundJoinRequest>>;
  findPaginatedForFund(
    fundId: string,
    page: number,
    limit: number,
    filter?: FindTenantJoinRequestsFilter,
  ): Promise<PaginatedResult<FundJoinRequest>>;
  countActiveByFundId(fundId: string): Promise<number>;
}
