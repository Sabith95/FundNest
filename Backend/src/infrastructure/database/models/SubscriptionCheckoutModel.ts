import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export type SubscriptionCheckoutStatus = "CREATED" | "PAID" | "FAILED";

export interface SubscriptionCheckoutDocument {
  tenantId: Types.ObjectId;
  planId: Types.ObjectId;
  planName: string;
  planType: string;
  amount: number;
  currency: "INR";
  durationDays: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: SubscriptionCheckoutStatus;
  failureReason?: string;
  expiresAt: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionCheckoutSchema = new Schema<SubscriptionCheckoutDocument>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Tenant",
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
    durationDays: { type: Number, required: true, min: 1 },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["CREATED", "PAID", "FAILED"],
      default: "CREATED",
      index: true,
    },
    failureReason: { type: String, trim: true },
    expiresAt: { type: Date, required: true, index: true },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "subscriptionCheckouts",
  },
);

export type HydratedSubscriptionCheckoutDocument =
  HydratedDocument<SubscriptionCheckoutDocument>;

export const SubscriptionCheckoutModel =
  models.SubscriptionCheckout ||
  model<SubscriptionCheckoutDocument>(
    "SubscriptionCheckout",
    subscriptionCheckoutSchema,
  );
