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
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
  {
    planType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
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
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "subscriptionPlans",
  },
);

// Partial unique index: names must be unique only among non-deleted plans
subscriptionPlanSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export type HydratedSubscriptionPlanDocument =
  HydratedDocument<SubscriptionPlanDocument>;

export const SubscriptionPlanModel =
  models.SubscriptionPlan ||
  model<SubscriptionPlanDocument>("SubscriptionPlan", subscriptionPlanSchema);
