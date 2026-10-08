import { PaginatedResult } from "../../../domain/repositories/types/Pagination";
import { FundJoinRequestResponseDto } from "../../user/dto/FundJoinRequestDto";

export interface GetTenantFundJoinRequestsFilterDto {
  page?: number;
  limit?: number;
  fundId?: string;
  status?: string;
  search?: string;
}

export interface IGetTenantFundJoinRequestsUseCase {
  execute(
    tenantId: string,
    filter: GetTenantFundJoinRequestsFilterDto,
  ): Promise<PaginatedResult<FundJoinRequestResponseDto>>;
}
