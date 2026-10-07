import { inject, injectable } from "tsyringe";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/ISubscriptionPlanRepository";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { ISubscriptionCheckoutRepository } from "../../../domain/repositories/ISubscriptionCheckoutRepository";
import { ITenantSubscriptionRepository } from "../../../domain/repositories/ITenantSubscriptionRepository";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { IPaymentService } from "../../../domain/interface/payment/IPaymentService";
import { env } from "../../../infrastructure/config/env";
import { TOKENS } from "../../../shared/tokens";
import { OnboardingStep } from "../../../shared/constants/enums/OnboardingStep";
import { TenantStatus } from "../../../shared/constants/enums/TenantStatus";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { SubscriptionCheckoutDtoMapper } from "../../mapper/SubscriptionCheckoutDtoMapper";
import { CreateSubscriptionCheckoutResponseDto } from "../dto/SubscriptionCheckoutDto";
import { ICreateSubscriptionCheckoutUseCase } from "../../interface/tenant/ICreateSubscriptionCheckoutUseCase";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class CreateSubscriptionCheckoutUseCase implements ICreateSubscriptionCheckoutUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TOKENS.TenantSubscriptionRepository)
    private readonly _tenantSubscriptionRepository: ITenantSubscriptionRepository,
    @inject(TOKENS.SubscriptionCheckoutRepository)
    private readonly _subscriptionCheckoutRepository: ISubscriptionCheckoutRepository,
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,
    @inject(TOKENS.RazorpayPaymentService)
    private readonly _razorpayPaymentService: IPaymentService,
  ) {}

  async execute(
    tenantId: string,
    planId: string,
  ): Promise<CreateSubscriptionCheckoutResponseDto> {
    const tenant = await this._tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError(MESSAGES.TENANT.NOT_FOUND);
    }

    if (
      !tenant.isActive ||
      tenant.status !== TenantStatus.APPROVED ||
      tenant.onboardingStep !== OnboardingStep.COMPLETED
    ) {
      throw new ForbiddenError(MESSAGES.TENANT.NOT_APPROVED);
    }

    const targetPlan = await this._subscriptionPlanRepository.findById(planId);
    if (!targetPlan || !targetPlan.isActive || targetPlan.isDeleted) {
      throw new NotFoundError(MESSAGES.PLAN.PLAN_NOT_FOUND);
    }

    const currentSubscription =
      await this._tenantSubscriptionRepository.findActiveByTenantId(tenantId);

    // Cannot re-purchase identical active plan
    if (
      currentSubscription &&
      !currentSubscription.isExpired() &&
      currentSubscription.planId === targetPlan.id
    ) {
      throw new ConflictError(MESSAGES.PLAN.ALREADY_ACTIVE);
    }

    // Downgrade Resource Validation
    // If tenant has an active subscription and is changing plans, check if existing resources fit target plan limits
    if (currentSubscription && !currentSubscription.isExpired()) {
      const existingFunds = await this._chitFundRepository.findByTenantId(tenantId);

      if (
        targetPlan.maxFunds !== null &&
        existingFunds.length > targetPlan.maxFunds
      ) {
        throw new ConflictError(
          MESSAGES.SUBSCRIPTION.DOWNGRADE_RESOURCE_LIMIT_EXCEEDED,
        );
      }

      if (targetPlan.maxUsers !== null) {
        const totalMembers = existingFunds.reduce(
          (sum, fund) => sum + fund.totalMembers,
          0,
        );
        if (totalMembers > targetPlan.maxUsers) {
          throw new ConflictError(
            MESSAGES.SUBSCRIPTION.DOWNGRADE_USER_LIMIT_EXCEEDED,
          );
        }
      }
    }

    // Price & Proration Calculation in Paise (1 INR = 100 paise)
    const targetPlanAmountPaise = Math.round(targetPlan.price * 100);
    let finalAmountPaise = targetPlanAmountPaise;

    //  Prorated credit calculation if active subscription exists
    if (currentSubscription && !currentSubscription.isExpired()) {
      const now = Date.now();
      const startsAtTime = currentSubscription.startsAt.getTime();
      const endsAtTime = currentSubscription.endsAt.getTime();
      const totalDurationMs = endsAtTime - startsAtTime;
      const remainingTimeMs = endsAtTime - now;

      if (remainingTimeMs > 0 && totalDurationMs > 0) {
        const remainingFraction = Math.min(1, Math.max(0, remainingTimeMs / totalDurationMs));
        const unusedCreditPaise = Math.round(currentSubscription.amount * remainingFraction);

        // Prorated charge: new plan price minus unused credit
        const proratedAmount = targetPlanAmountPaise - unusedCreditPaise;

        // Minimum charge is 100 paise (₹1.00) required by payment gateways like Razorpay
        finalAmountPaise = Math.max(100, proratedAmount);
      }
    }

    if (!Number.isSafeInteger(finalAmountPaise) || finalAmountPaise < 100) {
      throw new BadRequestError(MESSAGES.PLAN.INVALID_PRICE);
    }

    const receipt = `sub_${tenantId.slice(-8)}_${Date.now()}`;
    const razorpayOrder = await this._razorpayPaymentService.createOrder({
      amount: finalAmountPaise,
      currency: "INR",
      receipt,
      notes: {
        tenantId,
        planId: targetPlan.id,
      },
    });

    if (
      razorpayOrder.amount !== finalAmountPaise ||
      razorpayOrder.currency !== "INR"
    ) {
      throw new Error(MESSAGES.PAYMENT.ORDER_DETAILS_NOT_MATCHING);
    }

    const checkout = await this._subscriptionCheckoutRepository.create({
      tenantId,
      planId: targetPlan.id,
      planName: targetPlan.name,
      planType: targetPlan.planType,
      amount: finalAmountPaise,
      currency: "INR",
      billingCycle: targetPlan.billingCycle,
      durationDays: targetPlan.durationDays,
      maxFunds: targetPlan.maxFunds,
      maxUsers: targetPlan.maxUsers,
      hasAutopay: targetPlan.hasAutopay,
      hasFundSuggestions: targetPlan.hasFundSuggestions,
      razorpayOrderId: razorpayOrder.orderId,
      expiresAt: new Date(
        Date.now() + env.RAZORPAY_CHECKOUT_TTL_MINUTES * 60 * 1000,
      ),
    });

    return SubscriptionCheckoutDtoMapper.toCreateResponseDto(
      checkout,
      tenant,
      env.RAZORPAY_KEY_ID,
    );
  }
}