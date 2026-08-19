import { inject, injectable } from "tsyringe";
import { IGetTenantByIdUseCase } from "../../interface/admin/IGetTenantByIdUseCase";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { Tenant } from "../../../domain/entities/Tenant";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class GetTenantByIdUseCase implements IGetTenantByIdUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository
  ) {}

  async execute(id: string): Promise<Tenant> {
    const tenant = await this._tenantRepository.findById(id);

    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    return tenant;
  }
}