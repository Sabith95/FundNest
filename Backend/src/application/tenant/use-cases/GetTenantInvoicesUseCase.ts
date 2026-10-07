import { inject, injectable } from "tsyringe";
import { ISubscriptionCheckoutRepository } from "../../../domain/repositories/ISubscriptionCheckoutRepository";
import { ITenantSubscriptionRepository } from "../../../domain/repositories/ITenantSubscriptionRepository";
import { TOKENS } from "../../../shared/tokens";
import { TenantInvoiceResponseDto } from "../dto/TenantInvoiceDto";
import { IGetTenantInvoicesUseCase } from "../../interface/tenant/IGetTenantInvoicesUseCase";
import { TenantInvoiceDtoMapper } from "../../mapper/TenantInvoiceDtoMapper";

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

      const invoiceDto = TenantInvoiceDtoMapper.fromCheckout(checkout);
      if (invoiceDto) {
        invoices.push(invoiceDto);
      }
    }

    // Include current subscription if not already covered by checkouts
    if (
      currentSubscription &&
      (!currentSubscription.razorpayPaymentId ||
        !seenPaymentIds.has(currentSubscription.razorpayPaymentId)) &&
      (!currentSubscription.razorpayOrderId ||
        !seenOrderIds.has(currentSubscription.razorpayOrderId))
    ) {
      invoices.unshift(
        TenantInvoiceDtoMapper.fromSubscription(currentSubscription),
      );
    }

    invoices.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return invoices;
  }
}
