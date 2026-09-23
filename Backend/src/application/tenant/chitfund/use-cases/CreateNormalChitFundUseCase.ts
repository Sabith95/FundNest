import { inject, injectable } from "tsyringe";

import { IChitFundRepository } from "../../../../domain/repositories/IChitFundRepository";
import { ITenantSubscriptionRepository } from "../../../../domain/repositories/ITenantSubscriptionRepository";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/ISubscriptionPlanRepository";
import { TOKENS } from "../../../../shared/tokens";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { ForbiddenError } from "../../../../shared/errors/ForbiddenError";
import { FundType } from "../../../../shared/constants/enums/FundType";
import { ChitFundDtoMapper } from "../../../mapper/ChitFundDtoMapper";
import { CreateNormalChitFundDto } from "../dto/CreateNormalChitFundDto";
import { ChitFundResponseDto } from "../dto/ChitFundResponseDto";
import { ICreateNormalChitFundUseCase } from "../../../interface/tenant/chitfund/ICreateNormalChitFundUseCase";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class CreateNormalChitFundUseCase implements ICreateNormalChitFundUseCase {
  constructor(
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,
    @inject(TOKENS.TenantSubscriptionRepository)
    private readonly _tenantSubscriptionRepository: ITenantSubscriptionRepository,
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(
    tenantId: string,
    dto: CreateNormalChitFundDto,
  ): Promise<ChitFundResponseDto> {
    const subscription =
      await this._tenantSubscriptionRepository.findActiveByTenantId(tenantId);

    if (!subscription || subscription.isExpired()) {
      if (subscription && subscription.isExpired()) {
        await this._tenantSubscriptionRepository.markAsExpired(subscription.id);
      }
      throw new ForbiddenError(MESSAGES.FUND.NO_ACTIVE_SUBSCRIPTION);
    }

    const plan = await this._subscriptionPlanRepository.findById(
      subscription.planId,
    );

    if (!plan || !plan.isActive) {
      throw new ForbiddenError(MESSAGES.FUND.NO_ACTIVE_SUBSCRIPTION);
    }

    const existingFunds =
      await this._chitFundRepository.findByTenantId(tenantId);

    if (!plan.canCreateFund(existingFunds.length)) {
      throw new ForbiddenError(MESSAGES.FUND.MAX_FUNDS_EXCEEDED);
    }

    if (plan.maxUsers !== null) {
      const currentTotalMemberSlots = existingFunds.reduce(
        (sum, fund) => sum + fund.totalMembers,
        0,
      );
      const projectedTotalMemberSlots =
        currentTotalMemberSlots + dto.totalMembers;

      if (projectedTotalMemberSlots > plan.maxUsers) {
        throw new ForbiddenError(MESSAGES.FUND.MAX_USERS_EXCEEDED);
      }
    }

    const existingFund = await this._chitFundRepository.findByNameAndTenantId(
      dto.name.trim(),
      tenantId,
    );

    if (existingFund) {
      throw new ConflictError(MESSAGES.FUND.DUPLICATE_NAME);
    }

    const fund = await this._chitFundRepository.createFund({
      tenantId,
      name: dto.name.trim(),
      description: dto.description?.trim(),
      fundType: FundType.NORMAL,
      chitValue: dto.chitValue,
      contributionAmount: dto.contributionAmount,
      durationMonths: dto.durationMonths,
      totalMembers: dto.totalMembers,
      startDate: new Date(dto.startDate),
      division: null,
      isActive: true,
    });

    return ChitFundDtoMapper.toDto(fund);
  }
}
