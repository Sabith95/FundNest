import { inject, injectable } from "tsyringe";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/ISubscriptionPlanRepository";
import { TOKENS } from "../../../shared/tokens";
import { AvailableSubscriptionPlanDto } from "../dto/AvailableSubscriptionPlanDto";
import { IGetAvailableSubscriptionPlansUseCase } from "../../interface/tenant/IGetAvailableSubscriptionPlansUseCase";
import { AvailableSubscriptionPlanMapper } from "../../mapper/AvailableSubscriptionPlanMapper";

@injectable()
export class GetAvailableSubscriptionPlansUseCase implements IGetAvailableSubscriptionPlansUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(): Promise<AvailableSubscriptionPlanDto[]> {
    const plans = await this._subscriptionPlanRepository.find({
      isActive: true,
    });

    return plans.map(AvailableSubscriptionPlanMapper.toDto);
  }
}
