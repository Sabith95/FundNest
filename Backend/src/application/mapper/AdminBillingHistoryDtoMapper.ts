import { SubscriptionCheckout } from "../../domain/entities/SubscriptionCheckout";
import { TenantSubscription } from "../../domain/entities/TenantSubscription";
import { AdminBillingRecordDto } from "../admin/subscription/dto/AdminBillingHistoryDto";

export class AdminBillingHistoryDtoMapper {
  public static fromCheckout(
    checkout: SubscriptionCheckout,
    tenantName: string,
    tenantEmail: string,
  ): AdminBillingRecordDto | null {
    if (checkout.status !== "PAID" && checkout.status !== "FAILED") {
      return null;
    }

    const startsAt = checkout.paidAt || checkout.createdAt;
    const renewalDate = new Date(
      startsAt.getTime() + checkout.durationDays * 24 * 60 * 60 * 1000,
    );

    let status: "ACTIVE" | "EXPIRED" | "PAID" | "FAILED";
    if (checkout.status === "FAILED") {
      status = "FAILED";
    } else {
      const isExpired = renewalDate.getTime() < Date.now();
      status = isExpired ? "EXPIRED" : "ACTIVE";
    }

    return {
      id: checkout.id,
      tenantId: checkout.tenantId,
      tenantName,
      tenantEmail,
      planName: checkout.planName,
      planType: checkout.planType,
      billingCycle: checkout.billingCycle,
      amount: checkout.amount,
      currency: checkout.currency,
      status,
      startsAt,
      renewalDate,
      razorpayPaymentId: checkout.razorpayPaymentId,
      razorpayOrderId: checkout.razorpayOrderId,
      createdAt: checkout.createdAt,
    };
  }

  public static fromSubscription(
    subscription: TenantSubscription,
    tenantName: string,
    tenantEmail: string,
  ): AdminBillingRecordDto {
    const isExpired =
      subscription.isExpired() || subscription.endsAt.getTime() < Date.now();

    return {
      id: subscription.id,
      tenantId: subscription.tenantId,
      tenantName,
      tenantEmail,
      planName: subscription.planName,
      planType: subscription.planType,
      billingCycle: subscription.billingCycle,
      amount: subscription.amount,
      currency: subscription.currency,
      status: isExpired ? "EXPIRED" : subscription.status,
      startsAt: subscription.startsAt,
      renewalDate: subscription.endsAt,
      razorpayPaymentId: subscription.razorpayPaymentId,
      razorpayOrderId: subscription.razorpayOrderId,
      createdAt: subscription.createdAt,
    };
  }
}
