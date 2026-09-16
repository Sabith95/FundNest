import { inject, injectable } from "tsyringe";

import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { TOKENS } from "../../../../shared/tokens";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { SubscriptionPlanResponseDtoMapper } from "../../../mapper/SubscriptionPlanDtoMapper";
import {
  SubscriptionPlanResponseDto,
  UpdateSubscriptionPlanDto,
} from "../dto/SubscriptionPlanDto";
import { IUpdateSubscriptionPlanUseCase } from "../../../interface/admin/subscription/IUpdateSubscriptionPlanUseCase";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(
    planId: string,
    data: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlanResponseDto> {
    const existingPlan =
      await this._subscriptionPlanRepository.findById(planId);

    if (!existingPlan) {
      throw new NotFoundError(MESSAGES.SUBSCRIPTION.NOT_FOUND);
    }

    const planWithSameName = await this._subscriptionPlanRepository.findByName(
      data.name.trim(),
    );

    if (planWithSameName && planWithSameName.id !== planId) {
      throw new ConflictError(MESSAGES.SUBSCRIPTION.ALREADY_EXISTS);
    }

    existingPlan.updateDetails({
      name: data.name.trim(),
      price: data.price,
      billingCycle: data.billingCycle,
      durationDays: data.durationDays,
      maxFunds: data.maxFunds,
      maxUsers: data.maxUsers,
      hasAutopay: data.hasAutopay,
      hasFundSuggestions: data.hasFundSuggestions,
    });

    const updatedPlan = await this._subscriptionPlanRepository.updatePlan(
      planId,
      {
        name: existingPlan.name,
        price: existingPlan.price,
        billingCycle: existingPlan.billingCycle,
        durationDays: existingPlan.durationDays,
        maxFunds: existingPlan.maxFunds,
        maxUsers: existingPlan.maxUsers,
        hasAutopay: existingPlan.hasAutopay,
        hasFundSuggestions: existingPlan.hasFundSuggestions,
      },
    );

    if (!updatedPlan) {
      throw new NotFoundError(MESSAGES.SUBSCRIPTION.NOT_FOUND);
    }

    return SubscriptionPlanResponseDtoMapper.toDto(updatedPlan);
  }
}
