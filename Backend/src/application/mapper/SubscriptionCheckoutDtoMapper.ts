import { SubscriptionCheckout } from "../../domain/entities/SubscriptionCheckout";
import { Tenant } from "../../domain/entities/Tenant";
import { CreateSubscriptionCheckoutResponseDto } from "../tenant/dto/SubscriptionCheckoutDto";

export class SubscriptionCheckoutDtoMapper {
  public static toCreateResponseDto(
    checkout: SubscriptionCheckout,
    tenant: Tenant,
    razorpayKeyId: string,
  ): CreateSubscriptionCheckoutResponseDto {
    return {
      checkoutId: checkout.id,
      razorpayKeyId,
      razorpayOrderId: checkout.razorpayOrderId,
      amount: checkout.amount,
      currency: "INR",
      planName: checkout.planName,
      tenant: {
        name: tenant.ownerName,
        email: tenant.email,
        contact: tenant.phone,
      },
    };
  }
}
