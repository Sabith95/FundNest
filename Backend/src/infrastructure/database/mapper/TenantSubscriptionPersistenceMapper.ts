import { Types } from "mongoose";
import { TenantSubscription } from "../../../domain/entities/TenantSubscription";
import { TenantSubscriptionDocument } from "../models/TenantSubscriptionModel";

export type TenantSubscriptionRecord = TenantSubscriptionDocument & {
  _id: Types.ObjectId | string;
};

export class TenantSubscriptionPersistenceMapper {
  public static toDomain(doc: TenantSubscriptionRecord): TenantSubscription {
    return TenantSubscription.create({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      planId: doc.planId.toString(),
      planName: doc.planName,
      planType: doc.planType,
      amount: doc.amount,
      currency: doc.currency,
      startsAt: doc.startsAt,
      endsAt: doc.endsAt,
      status: doc.status,
      razorpayOrderId: doc.razorpayOrderId,
      razorpayPaymentId: doc.razorpayPaymentId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
