import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IFundJoinRequestRepository } from "../../../domain/repositories/IFundJoinRequestRepository";
import {
  GetTenantFundJoinRequestsFilterDto,
  IGetTenantFundJoinRequestsUseCase,
} from "../../interface/tenant/IGetTenantFundJoinRequestsUseCase";
import { PaginatedResult } from "../../../domain/repositories/types/Pagination";
import { FundJoinRequestResponseDto } from "../../user/dto/FundJoinRequestDto";
import { FundJoinRequestDtoMapper } from "../../mapper/FundJoinRequestDtoMapper";

@injectable()
export class GetTenantFundJoinRequestsUseCase
  implements IGetTenantFundJoinRequestsUseCase
{
  constructor(
    @inject(TOKENS.FundJoinRequestRepository)
    private readonly _fundJoinRequestRepository: IFundJoinRequestRepository,
  ) {}

  public async execute(
    tenantId: string,
    filter: GetTenantFundJoinRequestsFilterDto,
  ): Promise<PaginatedResult<FundJoinRequestResponseDto>> {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 10;

    const result = await this._fundJoinRequestRepository.findPaginatedForTenant(
      tenantId,
      page,
      limit,
      {
        fundId: filter.fundId,
        status: filter.status,
        search: filter.search,
      },
    );

    const data = result.data.map((entity) => {
      const dto = FundJoinRequestDtoMapper.toDto(entity);
      (dto as any).applicant = (entity as any).applicant;
      (dto as any).fundDetails = (entity as any).fundDetails;
      return dto;
    });

    return {
      data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
