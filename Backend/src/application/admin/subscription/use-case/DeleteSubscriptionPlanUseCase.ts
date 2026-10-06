import { inject, injectable } from "tsyringe";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { ITenantSubscriptionRepository } from "../../../../domain/repositories/ITenantSubscriptionRepository";
import { TOKENS } from "../../../../shared/tokens";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { SubscriptionPlanResponseDtoMapper } from "../../../mapper/SubscriptionPlanDtoMapper";
import { SubscriptionPlanResponseDto } from "../dto/SubscriptionPlanDto";
import { IDeleteSubscriptionPlanUseCase } from "../../../interface/admin/subscription/IDeleteSubscriptionPlanUseCase";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TOKENS.TenantSubscriptionRepository)
    private readonly _tenantSubscriptionRepository: ITenantSubscriptionRepository,
  ) {}

  async execute(planId: string): Promise<SubscriptionPlanResponseDto> {
    const plan = await this._subscriptionPlanRepository.findById(planId);

    if (!plan) {
      throw new NotFoundError(MESSAGES.SUBSCRIPTION.NOT_FOUND);
    }

    if (plan.isDeleted) {
      throw new BadRequestError(MESSAGES.SUBSCRIPTION.ALREADY_DELETED);
    }

    // Edge case check: Are there active tenant subscribers on this plan?
    const activeSubscribers =
      await this._tenantSubscriptionRepository.countActiveByPlanId(planId);

    if (activeSubscribers > 0) {
      throw new ConflictError(
        `Cannot delete this subscription plan because ${activeSubscribers} tenant(s) currently have an active subscription. Please deactivate/block the plan instead so no new tenants can join.`,
      );
    }

    const deletedPlan = await this._subscriptionPlanRepository.softDelete(planId);

    if (!deletedPlan) {
      throw new NotFoundError(MESSAGES.SUBSCRIPTION.NOT_FOUND);
    }

    return SubscriptionPlanResponseDtoMapper.toDto(deletedPlan);
  }
}