import { inject, injectable } from "tsyringe";
import { ITenantSubscriptionRepository } from "../../../domain/repositories/ITenantSubscriptionRepository";
import { TOKENS } from "../../../shared/tokens";
import { TenantSubscriptionDtoMapper } from "../../mapper/TenantSubscriptionDtoMapper";
import { TenantSubscriptionResponseDto } from "../dto/TenantSubscriptionDto";
import { IGetCurrentTenantSubscriptionUseCase } from "../../interface/tenant/IGetCurrentTenantSubscriptionUseCase";

@injectable()
export class GetCurrentTenantSubscriptionUseCase implements IGetCurrentTenantSubscriptionUseCase {
  constructor(
    @inject(TOKENS.TenantSubscriptionRepository)
    private readonly _tenantSubscriptionRepository: ITenantSubscriptionRepository,
  ) {}

  async execute(
    tenantId: string,
  ): Promise<TenantSubscriptionResponseDto | null> {
    const subscription =
      await this._tenantSubscriptionRepository.findByTenantId(tenantId);
    if (!subscription) {
      return null;
    }

    if (subscription.isExpired()) {
      await this._tenantSubscriptionRepository.markAsExpired(subscription.id);
      subscription.markAsExpired();
    }

    return TenantSubscriptionDtoMapper.toDto(subscription);
  }
}
