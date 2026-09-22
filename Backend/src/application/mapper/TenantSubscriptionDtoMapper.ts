import { TenantSubscription } from "../../domain/entities/TenantSubscription";
import { TenantSubscriptionResponseDto } from "../tenant/dto/TenantSubscriptionDto";

export class TenantSubscriptionDtoMapper {
  public static toDto(
    subscription: TenantSubscription,
  ): TenantSubscriptionResponseDto {
    return {
      id: subscription.id,
      tenantId: subscription.tenantId,
      planId: subscription.planId,
      planName: subscription.planName,
      planType: subscription.planType,
      amount: subscription.amount,
      currency: subscription.currency,
      startsAt: subscription.startsAt,
      endsAt: subscription.endsAt,
      status: subscription.status,
      razorpayOrderId: subscription.razorpayOrderId,
      razorpayPaymentId: subscription.razorpayPaymentId,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
