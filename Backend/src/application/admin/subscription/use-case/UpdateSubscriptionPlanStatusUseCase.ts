import { inject, injectable } from "tsyringe";

import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { TOKENS } from "../../../../shared/tokens";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { SubscriptionPlanResponseDtoMapper } from "../../../mapper/SubscriptionPlanDtoMapper";
import { SubscriptionPlanResponseDto } from "../dto/SubscriptionPlanDto";
import { IUpdateSubscriptionPlanStatusUseCase } from "../../../interface/admin/subscription/IUpdateSubscriptionPlanStatusUseCase";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class UpdateSubscriptionPlanStatusUseCase implements IUpdateSubscriptionPlanStatusUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(
    planId: string,
    isActive: boolean,
  ): Promise<SubscriptionPlanResponseDto> {
    const plan = await this._subscriptionPlanRepository.findById(planId);

    if (!plan) {
      throw new NotFoundError(MESSAGES.SUBSCRIPTION.NOT_FOUND);
    }

    if (isActive) {
      plan.activate();
    } else {
      plan.deactivate();
    }

    const updatedPlan = await this._subscriptionPlanRepository.updatePlan(
      planId,
      { isActive: plan.isActive },
    );

    if (!updatedPlan) {
      throw new NotFoundError(MESSAGES.SUBSCRIPTION.NOT_FOUND);
    }

    return SubscriptionPlanResponseDtoMapper.toDto(updatedPlan);
  }
}
