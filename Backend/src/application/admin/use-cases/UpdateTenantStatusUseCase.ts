import { inject, injectable } from "tsyringe";
import { IUpdateTenantStatusUseCase } from "../../interface/admin/IUpdateTenantStatusUseCase";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { Tenant } from "../../../domain/entities/Tenant";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class UpdateTenantStatusUseCase
  implements IUpdateTenantStatusUseCase
{
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository
  ) {}

  async execute(data: {
    tenantId: string;
    isActive: boolean;
  }): Promise<Tenant> {
    const tenant = await this._tenantRepository.updateActiveStatus(
      data.tenantId,
      data.isActive
    );

    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    return tenant;
  }
}