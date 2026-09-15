import { injectable } from "tsyringe";

import { SubscriptionPlan } from "../../domain/entities/SubscriptionPlan";
import { ISubscriptionPlanRepository } from "../../domain/repositories/ISubscriptionPlanRepository";

import { MongoBaseRepository } from "./MongoBaseRepository";
import { SubscriptionPlanModel } from "../database/models/SubscriptionPlanModel";
import {
  SubscriptionPlanPersistenceMapper,
  SubscriptionPlanRecord,
} from "../database/mapper/SubscriptionPlanPersistenceMapper";

@injectable()
export class SubscriptionPlanRepository
  extends MongoBaseRepository<SubscriptionPlan>
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlanModel);
  }

  async findByName(name: string): Promise<SubscriptionPlan | null> {
    const plan = await this.model
      .findOne({ name })
      .lean<SubscriptionPlanRecord>();

    if (!plan) {
      return null;
    }

    return this.toEntity(plan);
  }

  protected toEntity(doc: SubscriptionPlanRecord): SubscriptionPlan {
    return SubscriptionPlanPersistenceMapper.toEntity(doc);
  }
}
