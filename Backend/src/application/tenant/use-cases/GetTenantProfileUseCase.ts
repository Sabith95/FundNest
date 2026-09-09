import { inject, injectable } from "tsyringe";
import { IGetTenantProfileUseCase } from "../../interface/tenant/IGetTenantProfileUseCase";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";
import { TenantProfileResponseDto } from "../dto/TenantProfileResponseDto";
import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";

@injectable()
export class GetTenantProfileUseCase implements IGetTenantProfileUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository
  ) {}

  async execute(tenantId: string): Promise<TenantProfileResponseDto> {
    const tenant = await this._tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    // Delegate mapping to TenantResponseMapper
    return TenantResponseMapper.toProfileDto(tenant);
  }
}