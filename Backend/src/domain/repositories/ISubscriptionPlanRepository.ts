import { SubscriptionPlan } from "../entities/SubscriptionPlan";
import { IBaseRepository } from "./IBaseRepository";

export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlan> {
  findByName(name: string): Promise<SubscriptionPlan | null>;
}
