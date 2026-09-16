import { inject, injectable } from "tsyringe";

import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { TOKENS } from "../../../../shared/tokens";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { SubscriptionPlanResponseDtoMapper } from "../../../mapper/SubscriptionPlanDtoMapper";
import {
  CreateSubscriptionPlanDto,
  SubscriptionPlanResponseDto,
} from "../dto/SubscriptionPlanDto";
import { ICreateSubscriptionPlanUseCase } from "../../../interface/admin/subscription/ICreateSubsctiptionPlanUseCase";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(
    data: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlanResponseDto> {
    const existingPlan = await this._subscriptionPlanRepository.findByPlanType(
      data.planType,
    );

    if (existingPlan) {
      throw new ConflictError(
        MESSAGES.SUBSCRIPTION.ALREADY_EXISTS,
      );
    }

    const planWithSameName = await this._subscriptionPlanRepository.findByName(
      data.name.trim(),
    );

    if (planWithSameName) {
      throw new ConflictError(
        MESSAGES.SUBSCRIPTION.ALREADY_EXISTS,
      );
    }

    const plan = await this._subscriptionPlanRepository.createPlan({
      planType: data.planType,
      name: data.name.trim(),
      price: data.price,
      billingCycle: data.billingCycle,
      durationDays: data.durationDays,
      maxFunds: data.maxFunds,
      maxUsers: data.maxUsers,
      hasAutopay: data.hasAutopay,
      hasFundSuggestions: data.hasFundSuggestions,
      isActive: true,
    });

    return SubscriptionPlanResponseDtoMapper.toDto(plan);
  }
}
