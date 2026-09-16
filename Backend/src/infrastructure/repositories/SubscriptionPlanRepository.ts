import { injectable } from "tsyringe";

import { SubscriptionPlan } from "../../domain/entities/SubscriptionPlan";
import {
  CreateSubscriptionPlanData,
  ISubscriptionPlanRepository,
  UpdateSubscriptionPlanData,
} from "../../domain/repositories/ISubscriptionPlanRepository";
import { PlanType } from "../../shared/constants/enums/PlanType";
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

    return plan ? this.toEntity(plan) : null;
  }

  async findByPlanType(planType: PlanType): Promise<SubscriptionPlan | null> {
    const plan = await this.model
      .findOne({ planType })
      .lean<SubscriptionPlanRecord>();

    return plan ? this.toEntity(plan) : null;
  }

  async createPlan(
    data: CreateSubscriptionPlanData,
  ): Promise<SubscriptionPlan> {
    const plan = await this.model.create(data);

    return this.toEntity(plan.toObject());
  }

  async updatePlan(
    id: string,
    data: UpdateSubscriptionPlanData,
  ): Promise<SubscriptionPlan | null> {
    const plan = await this.model
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .lean<SubscriptionPlanRecord>();

    return plan ? this.toEntity(plan) : null;
  }

  protected toEntity(doc: SubscriptionPlanRecord): SubscriptionPlan {
    return SubscriptionPlanPersistenceMapper.toEntity(doc);
  }
}
