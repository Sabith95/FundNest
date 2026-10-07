import { inject, injectable } from "tsyringe";
import { ISubscriptionCheckoutRepository } from "../../../domain/repositories/ISubscriptionCheckoutRepository";
import { ITenantSubscriptionRepository } from "../../../domain/repositories/ITenantSubscriptionRepository";
import { TOKENS } from "../../../shared/tokens";
import { TenantInvoiceResponseDto } from "../dto/TenantInvoiceDto";
import { IGetTenantInvoicesUseCase } from "../../interface/tenant/IGetTenantInvoicesUseCase";

@injectable()
export class GetTenantInvoicesUseCase implements IGetTenantInvoicesUseCase {
  constructor(
    @inject(TOKENS.SubscriptionCheckoutRepository)
    private readonly _subscriptionCheckoutRepository: ISubscriptionCheckoutRepository,
    @inject(TOKENS.TenantSubscriptionRepository)
    private readonly _tenantSubscriptionRepository: ITenantSubscriptionRepository,
  ) {}

  async execute(tenantId: string): Promise<TenantInvoiceResponseDto[]> {
    const [checkouts, currentSubscription] = await Promise.all([
      this._subscriptionCheckoutRepository.findAllByTenantId(tenantId),
      this._tenantSubscriptionRepository.findByTenantId(tenantId),
    ]);

    const invoices: TenantInvoiceResponseDto[] = [];
    const seenPaymentIds = new Set<string>();
    const seenOrderIds = new Set<string>();

    for (const checkout of checkouts) {
      if (checkout.razorpayPaymentId) {
        seenPaymentIds.add(checkout.razorpayPaymentId);
      }
      if (checkout.razorpayOrderId) {
        seenOrderIds.add(checkout.razorpayOrderId);
      }

      let status: "PAID" | "FAILED" | "PENDING";
      if (checkout.status === "PAID") {
        status = "PAID";
      } else if (checkout.status === "FAILED") {
        status = "FAILED";
      } else {
        if (checkout.isExpired()) {
          continue; // Skip abandoned checkout sessions
        }
        status = "PENDING";
      }

      const invoiceDate = checkout.paidAt || checkout.createdAt;
      const periodEnd = new Date(
        invoiceDate.getTime() + checkout.durationDays * 24 * 60 * 60 * 1000,
      );

      invoices.push({
        id: checkout.id,
        invoiceNumber: `INV-${(checkout.razorpayPaymentId || checkout.id).slice(-8).toUpperCase()}`,
        planName: checkout.planName,
        planType: checkout.planType,
        amount: checkout.amount,
        currency: checkout.currency,
        billingCycle: checkout.billingCycle,
        status,
        razorpayPaymentId: checkout.razorpayPaymentId || "",
        razorpayOrderId: checkout.razorpayOrderId,
        date: invoiceDate,
        periodStart: invoiceDate,
        periodEnd,
        createdAt: checkout.createdAt,
      });
    }

    // Include current subscription if not already covered by checkouts
    if (
      currentSubscription &&
      (!currentSubscription.razorpayPaymentId ||
        !seenPaymentIds.has(currentSubscription.razorpayPaymentId)) &&
      (!currentSubscription.razorpayOrderId ||
        !seenOrderIds.has(currentSubscription.razorpayOrderId))
    ) {
      invoices.unshift({
        id: currentSubscription.id,
        invoiceNumber: `INV-${(currentSubscription.razorpayPaymentId || currentSubscription.id).slice(-8).toUpperCase()}`,
        planName: currentSubscription.planName,
        planType: currentSubscription.planType,
        amount: currentSubscription.amount,
        currency: currentSubscription.currency,
        billingCycle: currentSubscription.billingCycle,
        status: "PAID",
        razorpayPaymentId: currentSubscription.razorpayPaymentId,
        razorpayOrderId: currentSubscription.razorpayOrderId,
        date: currentSubscription.startsAt,
        periodStart: currentSubscription.startsAt,
        periodEnd: currentSubscription.endsAt,
        createdAt: currentSubscription.createdAt,
      });
    }

    invoices.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return invoices;
  }
}
