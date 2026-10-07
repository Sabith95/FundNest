import { inject, injectable } from "tsyringe";
import { ITenantRepository } from "../../../../domain/repositories/ITenantRepository";
import { ITenantSubscriptionRepository } from "../../../../domain/repositories/ITenantSubscriptionRepository";
import { ISubscriptionCheckoutRepository } from "../../../../domain/repositories/ISubscriptionCheckoutRepository";
import { TOKENS } from "../../../../shared/tokens";
import { AdminBillingRecordDto } from "../dto/AdminBillingHistoryDto";
import { IGetAdminBillingHistoryUseCase } from "../../../interface/admin/subscription/IGetAdminBillingHistoryUseCase";
import { AdminBillingHistoryDtoMapper } from "../../../mapper/AdminBillingHistoryDtoMapper";

@injectable()
export class GetAdminBillingHistoryUseCase
  implements IGetAdminBillingHistoryUseCase
{
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
    @inject(TOKENS.TenantSubscriptionRepository)
    private readonly _tenantSubscriptionRepository: ITenantSubscriptionRepository,
    @inject(TOKENS.SubscriptionCheckoutRepository)
    private readonly _subscriptionCheckoutRepository: ISubscriptionCheckoutRepository,
  ) {}

  async execute(): Promise<AdminBillingRecordDto[]> {
    const [tenants, subscriptions, checkouts] = await Promise.all([
      this._tenantRepository.find(),
      this._tenantSubscriptionRepository.find(),
      this._subscriptionCheckoutRepository.find(),
    ]);

    const tenantMap = new Map<string, { name: string; email: string }>();
    for (const t of tenants) {
      tenantMap.set(t.id, {
        name: t.companyName || t.ownerName || "Unknown Tenant",
        email: t.email || "",
      });
    }

    const records: AdminBillingRecordDto[] = [];
    const seenPaymentIds = new Set<string>();
    const seenOrderIds = new Set<string>();

    // Process all checkout transaction records
    for (const checkout of checkouts) {
      if (checkout.razorpayPaymentId) {
        seenPaymentIds.add(checkout.razorpayPaymentId);
      }
      if (checkout.razorpayOrderId) {
        seenOrderIds.add(checkout.razorpayOrderId);
      }

      const tenantInfo = tenantMap.get(checkout.tenantId) ?? {
        name: "Unknown Tenant",
        email: "",
      };

      const recordDto = AdminBillingHistoryDtoMapper.fromCheckout(
        checkout,
        tenantInfo.name,
        tenantInfo.email,
      );

      if (recordDto) {
        records.push(recordDto);
      }
    }

    // Include subscriptions not captured in checkout records
    for (const sub of subscriptions) {
      const alreadyIncluded =
        (sub.razorpayPaymentId && seenPaymentIds.has(sub.razorpayPaymentId)) ||
        (sub.razorpayOrderId && seenOrderIds.has(sub.razorpayOrderId));

      if (!alreadyIncluded) {
        const tenantInfo = tenantMap.get(sub.tenantId) ?? {
          name: "Unknown Tenant",
          email: "",
        };

        records.push(
          AdminBillingHistoryDtoMapper.fromSubscription(
            sub,
            tenantInfo.name,
            tenantInfo.email,
          ),
        );
      }
    }

    // Sort newest first
    records.sort(
      (a, b) =>
        new Date(b.createdAt || b.startsAt).getTime() -
        new Date(a.createdAt || a.startsAt).getTime(),
    );

    return records;
  }
}
