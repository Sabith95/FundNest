import { Types } from "mongoose";
import { injectable } from "tsyringe";
import { TenantSubscription } from "../../domain/entities/TenantSubscription";
import {
  ITenantSubscriptionRepository,
  UpsertSubscriptionData,
} from "../../domain/repositories/ITenantSubscriptionRepository";
import { TenantSubscriptionModel } from "../database/models/TenantSubscriptionModel";
import {
  TenantSubscriptionPersistenceMapper,
  TenantSubscriptionRecord,
} from "../database/mapper/TenantSubscriptionPersistenceMapper";
import { MongoBaseRepository } from "./MongoBaseRepository";

@injectable()
export class TenantSubscriptionRepository
  extends MongoBaseRepository<TenantSubscription>
  implements ITenantSubscriptionRepository
{
  constructor() {
    super(TenantSubscriptionModel);
  }

  async findByTenantId(tenantId: string): Promise<TenantSubscription | null> {
    const doc = await this.model
      .findOne({ tenantId: new Types.ObjectId(tenantId) })
      .lean<TenantSubscriptionRecord>();

    return doc ? this.toEntity(doc) : null;
  }

  async findActiveByTenantId(
    tenantId: string,
  ): Promise<TenantSubscription | null> {
    const doc = await this.model
      .findOne({
        tenantId: new Types.ObjectId(tenantId),
        status: "ACTIVE",
      })
      .lean<TenantSubscriptionRecord>();

    return doc ? this.toEntity(doc) : null;
  }

  async upsertSubscription(
    data: UpsertSubscriptionData,
  ): Promise<TenantSubscription> {
    const doc = await this.model
      .findOneAndUpdate(
        { tenantId: new Types.ObjectId(data.tenantId) },
        {
          $set: {
            tenantId: new Types.ObjectId(data.tenantId),
            planId: new Types.ObjectId(data.planId),
            planName: data.planName,
            planType: data.planType,
            amount: data.amount,
            currency: data.currency,
            startsAt: data.startsAt,
            endsAt: data.endsAt,
            status: data.status,
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentId: data.razorpayPaymentId,
          },
        },
        { new: true, upsert: true, runValidators: true },
      )
      .lean<TenantSubscriptionRecord>();

    return this.toEntity(doc!);
  }

  async markAsExpired(id: string): Promise<void> {
    await this.model.updateOne(
      { _id: id, status: "ACTIVE" },
      { $set: { status: "EXPIRED" } },
    );
  }

  protected toEntity(doc: TenantSubscriptionRecord): TenantSubscription {
    return TenantSubscriptionPersistenceMapper.toDomain(doc);
  }
}
