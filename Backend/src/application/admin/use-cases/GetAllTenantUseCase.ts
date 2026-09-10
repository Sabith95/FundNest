import { injectable, inject } from "tsyringe";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { IGetAllTenantsUseCase } from "../../interface/admin/IGetAllTenantsUseCase";
import { GetAllTenantsRequestDto } from "../dto/GetAllTenantRequestDto";
import { TOKENS } from "../../../shared/tokens";
import { AdminTenantResponseDtoMapper } from "../../mapper/AdminTenantResponseDtoMapper";

@injectable()
export class GetAllTenantUseCase implements IGetAllTenantsUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(data: GetAllTenantsRequestDto) {
    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const search = data.search;

    const result = await this._tenantRepository.findPaginated(
      page,
      limit,
      search,
    );

    return {
      tenants: AdminTenantResponseDtoMapper.toDtoList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
