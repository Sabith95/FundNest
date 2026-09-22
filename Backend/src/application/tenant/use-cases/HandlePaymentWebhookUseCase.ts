import crypto from "crypto";
import { inject, injectable } from "tsyringe";
import { ISubscriptionCheckoutRepository } from "../../../domain/repositories/ISubscriptionCheckoutRepository";
import { ITenantSubscriptionRepository } from "../../../domain/repositories/ITenantSubscriptionRepository";
import { IRazorpayPaymentService } from "../../../infrastructure/payment/interface/IRazorpayPaymentService";
import { env } from "../../../infrastructure/config/env";
import { TOKENS } from "../../../shared/tokens";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { IHandlePaymentWebhookUseCase } from "../../interface/tenant/IHandlePaymentWebhookUseCase";

@injectable()
export class HandlePaymentWebhookUseCase implements IHandlePaymentWebhookUseCase {
  constructor(
    @inject(TOKENS.SubscriptionCheckoutRepository)
    private readonly _subscriptionCheckoutRepository: ISubscriptionCheckoutRepository,
    @inject(TOKENS.TenantSubscriptionRepository)
    private readonly _tenantSubscriptionRepository: ITenantSubscriptionRepository,
    @inject(TOKENS.RazorpayPaymentService)
    private readonly _razorpayPaymentService: IRazorpayPaymentService,
  ) {}

  async execute(rawBody: Buffer, signature: string | undefined): Promise<void> {
    if (!signature) {
      throw new ForbiddenError("Missing Razorpay webhook signature");
    }

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (!this.signaturesMatch(expectedSignature, signature)) {
      throw new ForbiddenError("Invalid Razorpay webhook signature");
    }

    const event = JSON.parse(rawBody.toString("utf8")) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            error_description?: string;
          };
        };
      };
    };

    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) {
      return;
    }

    const checkout =
      await this._subscriptionCheckoutRepository.findByRazorpayOrderId(
        payment.order_id,
      );
    if (!checkout) {
      return;
    }

    if (event.event === "payment.failed") {
      await this._subscriptionCheckoutRepository.markAsFailed(
        checkout.id,
        payment.error_description ?? "Payment failed",
      );
      return;
    }

    if (
      (event.event === "payment.captured" || event.event === "order.paid") &&
      payment.id
    ) {
      const verifiedPayment = await this._razorpayPaymentService.getPayment(
        payment.id,
      );

      if (
        verifiedPayment.order_id === checkout.razorpayOrderId &&
        verifiedPayment.amount === checkout.amount &&
        verifiedPayment.currency === checkout.currency &&
        verifiedPayment.status === "captured"
      ) {
        const paidAt = checkout.paidAt ?? new Date();
        const startsAt = paidAt;
        const endsAt = new Date(
          startsAt.getTime() + checkout.durationDays * 24 * 60 * 60 * 1000,
        );

        await this._subscriptionCheckoutRepository.markAsPaid(
          checkout.id,
          payment.id,
          paidAt,
        );

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
          razorpayPaymentId: payment.id,
        });
      }
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
