import { Types } from "mongoose";
import { SubscriptionCheckout } from "../../../domain/entities/SubscriptionCheckout";
import { SubscriptionCheckoutDocument } from "../models/SubscriptionCheckoutModel";

export type SubscriptionCheckoutRecord = SubscriptionCheckoutDocument & {
  _id: Types.ObjectId | string;
};

export class SubscriptionCheckoutPersistenceMapper {
  public static toDomain(
    doc: SubscriptionCheckoutRecord,
  ): SubscriptionCheckout {
    return SubscriptionCheckout.create({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      planId: doc.planId.toString(),
      planName: doc.planName,
      planType: doc.planType,
      amount: doc.amount,
      currency: doc.currency,
      billingCycle: doc.billingCycle,
      durationDays: doc.durationDays,
      maxFunds: doc.maxFunds ?? null,
      maxUsers: doc.maxUsers ?? null,
      hasAutopay: doc.hasAutopay ?? false,
      hasFundSuggestions: doc.hasFundSuggestions ?? false,
      razorpayOrderId: doc.razorpayOrderId,
      razorpayPaymentId: doc.razorpayPaymentId,
      status: doc.status,
      failureReason: doc.failureReason,
      expiresAt: doc.expiresAt,
      paidAt: doc.paidAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
