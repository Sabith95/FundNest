import crypto from "crypto";
import { inject, injectable } from "tsyringe";
import { ISubscriptionCheckoutRepository } from "../../../domain/repositories/ISubscriptionCheckoutRepository";
import { ITenantSubscriptionRepository } from "../../../domain/repositories/ITenantSubscriptionRepository";
import { IRazorpayPaymentService } from "../../../infrastructure/payment/interface/IRazorpayPaymentService";
import { env } from "../../../infrastructure/config/env";
import { TOKENS } from "../../../shared/tokens";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { TenantSubscriptionDtoMapper } from "../../mapper/TenantSubscriptionDtoMapper";
import { VerifySubscriptionCheckoutInputDto } from "../dto/SubscriptionCheckoutDto";
import { TenantSubscriptionResponseDto } from "../dto/TenantSubscriptionDto";
import { IVerifySubscriptionCheckoutUseCase } from "../../interface/tenant/IVerifySubscriptionCheckoutUseCase";
import { SubscriptionCheckout } from "../../../domain/entities/SubscriptionCheckout";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class VerifySubscriptionCheckoutUseCase implements IVerifySubscriptionCheckoutUseCase {
  constructor(
    @inject(TOKENS.SubscriptionCheckoutRepository)
    private readonly _subscriptionCheckoutRepository: ISubscriptionCheckoutRepository,
    @inject(TOKENS.TenantSubscriptionRepository)
    private readonly _tenantSubscriptionRepository: ITenantSubscriptionRepository,
    @inject(TOKENS.RazorpayPaymentService)
    private readonly _razorpayPaymentService: IRazorpayPaymentService,
  ) {}

  async execute(
    tenantId: string,
    input: VerifySubscriptionCheckoutInputDto,
  ): Promise<TenantSubscriptionResponseDto> {
    const checkout = await this._subscriptionCheckoutRepository.findById(
      input.checkoutId,
    );
    if (!checkout || checkout.tenantId !== tenantId) {
      throw new NotFoundError(MESSAGES.PAYMENT.CHECKOUT_SESSION_NOT_FOUND);
    }

    if (checkout.razorpayOrderId !== input.razorpayOrderId) {
      throw new BadRequestError(MESSAGES.PAYMENT.CHECKOUT_ORDER_MISMATCH);
    }

    if (checkout.isExpired()) {
      throw new BadRequestError(MESSAGES.PAYMENT.CHECKOUT_SESSSION_EXPIRED);
    }

    this.assertSignature(
      checkout.razorpayOrderId,
      input.razorpayPaymentId,
      input.razorpaySignature,
    );

    const payment = await this._razorpayPaymentService.getPayment(
      input.razorpayPaymentId,
    );
    this.assertPaymentMatchesCheckout(checkout, payment);

    return this.fulfilCheckout(checkout, input.razorpayPaymentId);
  }

  private async fulfilCheckout(
    checkout: SubscriptionCheckout,
    paymentId: string,
  ): Promise<TenantSubscriptionResponseDto> {
    if (
      checkout.status === "PAID" &&
      checkout.razorpayPaymentId &&
      checkout.razorpayPaymentId !== paymentId
    ) {
      throw new ConflictError(MESSAGES.PAYMENT.CHECKOUT_ALREADY_COMPLETED);
    }

    const paidAt = checkout.paidAt ?? new Date();
    const startsAt = paidAt;
    const endsAt = new Date(
      startsAt.getTime() + checkout.durationDays * 24 * 60 * 60 * 1000,
    );

    await this._subscriptionCheckoutRepository.markAsPaid(
      checkout.id,
      paymentId,
      paidAt,
    );

    const subscription =
      await this._tenantSubscriptionRepository.upsertSubscription({
        tenantId: checkout.tenantId,
        planId: checkout.planId,
        planName: checkout.planName,
        planType: checkout.planType,
        amount: checkout.amount,
        currency: checkout.currency,
        startsAt,
        endsAt,
        status: "ACTIVE",
        razorpayOrderId: checkout.razorpayOrderId,
        razorpayPaymentId: paymentId,
      });

    return TenantSubscriptionDtoMapper.toDto(subscription);
  }

  private assertSignature(
    orderId: string,
    paymentId: string,
    receivedSignature: string,
  ): void {
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_SECRET_KEY)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (!this.signaturesMatch(expectedSignature, receivedSignature)) {
      throw new ForbiddenError(MESSAGES.PAYMENT.INVALID_PAYMENT_SIGNATURE);
    }
  }

  private assertPaymentMatchesCheckout(
    checkout: SubscriptionCheckout,
    payment: {
      id: string;
      order_id: string;
      amount: number;
      currency: string;
      status: string;
    },
  ): void {
    if (
      payment.order_id !== checkout.razorpayOrderId ||
      payment.amount !== checkout.amount ||
      payment.currency !== checkout.currency
    ) {
      throw new BadRequestError(MESSAGES.PAYMENT.DETAILS_NOT_MATCHING);
    }

    if (payment.status !== "captured") {
      throw new ConflictError(
        MESSAGES.PAYMENT.NOT_CAPTURED,
      );
    }
  }

  private signaturesMatch(expected: string, received: string): boolean {
    const expectedBuffer = Buffer.from(expected, "utf8");
    const receivedBuffer = Buffer.from(received, "utf8");
    return (
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    );
  }
}
