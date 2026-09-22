import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export type TenantSubscriptionStatus = "ACTIVE" | "EXPIRED";

export interface TenantSubscriptionDocument {
  tenantId: Types.ObjectId;
  planId: Types.ObjectId;
  planName: string;
  planType: string;
  amount: number;
  currency: "INR";
  startsAt: Date;
  endsAt: Date;
  status: TenantSubscriptionStatus;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSubscriptionSchema = new Schema<TenantSubscriptionDocument>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Tenant",
      unique: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "SubscriptionPlan",
    },
    planName: { type: String, required: true, trim: true },
    planType: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, enum: ["INR"], default: "INR" },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    collection: "tenantSubscriptions",
  },
);

export type HydratedTenantSubscriptionDocument =
  HydratedDocument<TenantSubscriptionDocument>;

export const TenantSubscriptionModel =
  models.TenantSubscription ||
  model<TenantSubscriptionDocument>(
    "TenantSubscription",
    tenantSubscriptionSchema,
  );
