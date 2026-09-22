import { inject, injectable } from "tsyringe";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/ISubscriptionPlanRepository";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { ISubscriptionCheckoutRepository } from "../../../domain/repositories/ISubscriptionCheckoutRepository";
import { ITenantSubscriptionRepository } from "../../../domain/repositories/ITenantSubscriptionRepository";
import { IRazorpayPaymentService } from "../../../infrastructure/payment/interface/IRazorpayPaymentService";
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
    @inject(TOKENS.RazorpayPaymentService)
    private readonly _razorpayPaymentService: IRazorpayPaymentService,
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
      throw new ForbiddenError(
        MESSAGES.TENANT.NOT_APPROVED,
      );
    }

    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan || !plan.isActive) {
      throw new NotFoundError(MESSAGES.PLAN.PLAN_NOT_FOUND);
    }

    const currentSubscription =
      await this._tenantSubscriptionRepository.findActiveByTenantId(tenantId);
    if (
      currentSubscription &&
      currentSubscription.planId === plan.id &&
      currentSubscription.endsAt.getTime() > Date.now()
    ) {
      throw new ConflictError(MESSAGES.PLAN.ALREADY_ACTIVE);
    }

    const amount = Math.round(plan.price * 100);
    if (!Number.isSafeInteger(amount) || amount < 100) {
      throw new BadRequestError(MESSAGES.PLAN.INVALID_PRICE);
    }

    const receipt = `sub_${tenantId.slice(-8)}_${Date.now()}`;
    const razorpayOrder = await this._razorpayPaymentService.createOrder({
      amount,
      currency: "INR",
      receipt,
      notes: {
        tenantId,
        planId: plan.id,
      },
    });

    if (razorpayOrder.amount !== amount || razorpayOrder.currency !== "INR") {
      throw new Error(MESSAGES.PAYMENT.ORDER_DETAILS_NOT_MATCHING);
    }

    const checkout = await this._subscriptionCheckoutRepository.create({
      tenantId,
      planId: plan.id,
      planName: plan.name,
      planType: plan.planType,
      amount,
      currency: "INR",
      durationDays: plan.durationDays,
      razorpayOrderId: razorpayOrder.id,
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
