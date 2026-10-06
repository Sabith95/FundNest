import { inject, injectable } from "tsyringe";

import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { TOKENS } from "../../../../shared/tokens";
import { SubscriptionPlanResponseDtoMapper } from "../../../mapper/SubscriptionPlanDtoMapper";
import { SubscriptionPlanResponseDto } from "../dto/SubscriptionPlanDto";
import { IGetSubscriptionPlansUseCase } from "../../../interface/admin/subscription/IGetSubscriptionPlansUseCase";

@injectable()
export class GetSubscriptionPlansUseCase implements IGetSubscriptionPlansUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(): Promise<SubscriptionPlanResponseDto[]> {
    // Only return non-deleted plans to super admin
    const plans = await this._subscriptionPlanRepository.findNonDeleted();

    return plans.map(SubscriptionPlanResponseDtoMapper.toDto);
  }
}