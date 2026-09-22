import { Types } from "mongoose";
import { injectable } from "tsyringe";
import { SubscriptionCheckout } from "../../domain/entities/SubscriptionCheckout";
import {
  CreateCheckoutData,
  ISubscriptionCheckoutRepository,
} from "../../domain/repositories/ISubscriptionCheckoutRepository";
import { SubscriptionCheckoutModel } from "../database/models/SubscriptionCheckoutModel";
import {
  SubscriptionCheckoutPersistenceMapper,
  SubscriptionCheckoutRecord,
} from "../database/mapper/SubscriptionCheckoutPersistenceMapper";
import { MongoBaseRepository } from "./MongoBaseRepository";

@injectable()
export class SubscriptionCheckoutRepository
  extends MongoBaseRepository<SubscriptionCheckout>
  implements ISubscriptionCheckoutRepository
{
  constructor() {
    super(SubscriptionCheckoutModel);
  }

  async create(data: CreateCheckoutData): Promise<SubscriptionCheckout> {
    const doc = await this.model.create({
      tenantId: new Types.ObjectId(data.tenantId),
      planId: new Types.ObjectId(data.planId),
      planName: data.planName,
      planType: data.planType,
      amount: data.amount,
      currency: data.currency,
      durationDays: data.durationDays,
      razorpayOrderId: data.razorpayOrderId,
      expiresAt: data.expiresAt,
      status: "CREATED",
    });

    return this.toEntity(doc.toObject());
  }

  async findByRazorpayOrderId(
    orderId: string,
  ): Promise<SubscriptionCheckout | null> {
    const doc = await this.model
      .findOne({ razorpayOrderId: orderId })
      .lean<SubscriptionCheckoutRecord>();

    return doc ? this.toEntity(doc) : null;
  }

  async markAsPaid(
    id: string,
    paymentId: string,
    paidAt: Date,
  ): Promise<SubscriptionCheckout | null> {
    const doc = await this.model
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            status: "PAID",
            razorpayPaymentId: paymentId,
            paidAt,
            failureReason: undefined,
          },
        },
        { new: true },
      )
      .lean<SubscriptionCheckoutRecord>();

    return doc ? this.toEntity(doc) : null;
  }

  async markAsFailed(id: string, failureReason: string): Promise<void> {
    await this.model.updateOne(
      { _id: id, status: { $ne: "PAID" } },
      {
        $set: {
          status: "FAILED",
          failureReason,
        },
      },
    );
  }

  protected toEntity(doc: SubscriptionCheckoutRecord): SubscriptionCheckout {
    return SubscriptionCheckoutPersistenceMapper.toDomain(doc);
  }
}
