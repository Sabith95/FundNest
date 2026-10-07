import { SubscriptionCheckout } from "../../domain/entities/SubscriptionCheckout";
import { TenantSubscription } from "../../domain/entities/TenantSubscription";
import { TenantInvoiceResponseDto } from "../tenant/dto/TenantInvoiceDto";

export class TenantInvoiceDtoMapper {
  public static fromCheckout(
    checkout: SubscriptionCheckout,
  ): TenantInvoiceResponseDto | null {
    let status: "PAID" | "FAILED" | "PENDING";
    if (checkout.status === "PAID") {
      status = "PAID";
    } else if (checkout.status === "FAILED") {
      status = "FAILED";
    } else {
      if (checkout.isExpired()) {
        return null; // Skip expired checkout sessions
      }
      status = "PENDING";
    }

    const invoiceDate = checkout.paidAt || checkout.createdAt;
    const periodEnd = new Date(
      invoiceDate.getTime() + checkout.durationDays * 24 * 60 * 60 * 1000,
    );

    return {
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
    };
  }

  public static fromSubscription(
    subscription: TenantSubscription,
  ): TenantInvoiceResponseDto {
    return {
      id: subscription.id,
      invoiceNumber: `INV-${(subscription.razorpayPaymentId || subscription.id).slice(-8).toUpperCase()}`,
      planName: subscription.planName,
      planType: subscription.planType,
      amount: subscription.amount,
      currency: subscription.currency,
      billingCycle: subscription.billingCycle,
      status: "PAID",
      razorpayPaymentId: subscription.razorpayPaymentId,
      razorpayOrderId: subscription.razorpayOrderId,
      date: subscription.startsAt,
      periodStart: subscription.startsAt,
      periodEnd: subscription.endsAt,
      createdAt: subscription.createdAt,
    };
  }
}
