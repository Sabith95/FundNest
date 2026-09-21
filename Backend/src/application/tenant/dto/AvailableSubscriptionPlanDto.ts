import { BillingCycle } from "../../../shared/constants/enums/BillingCycle";
import { PlanType } from "../../../shared/constants/enums/PlanType";

export interface AvailableSubscriptionPlanDto {
  id: string;
  planType: PlanType;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
  hasFundSuggestions: boolean;
}
