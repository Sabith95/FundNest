import { HydratedDocument, model, models, Schema } from "mongoose";

import { BillingCycle } from "../../../shared/constants/enums/BillingCycle";
import { PlanType } from "../../../shared/constants/enums/PlanType";

export interface SubscriptionPlanDocument {
  planType: PlanType;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  durationDays: number;
  maxFunds: number | null;
  maxUsers: number | null;
  hasAutopay: boolean;
  hasFundSuggestions: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
  {
    planType: {
      type: String,
      enum: Object.values(PlanType),
      required: true,
      unique: true,
      index: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    billingCycle: {
      type: String,
      enum: Object.values(BillingCycle),
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    maxFunds: {
      type: Number,
      default: null,
      min: 1,
    },
    maxUsers: {
      type: Number,
      default: null,
      min: 1,
    },
    hasAutopay: {
      type: Boolean,
      default: false,
    },
    hasFundSuggestions: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "subscriptionPlans",
  },
);

export type HydratedSubscriptionPlanDocument =
  HydratedDocument<SubscriptionPlanDocument>;

export const SubscriptionPlanModel =
  models.SubscriptionPlan ||
  model<SubscriptionPlanDocument>("SubscriptionPlan", subscriptionPlanSchema);
