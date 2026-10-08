import { HydratedDocument, model, models, Schema, Types } from "mongoose";
import {
  DocumentVerificationStatus,
  FundJoinStatus,
} from "../../../domain/entities/FundJoinRequest";

export interface SubmittedKycDocumentSubdocument {
  requirementId: string;
  documentType: string;
  title: string;
  frontSideKey: string;
  backSideKey?: string;
  status: DocumentVerificationStatus;
  rejectionReason?: string;
}

export interface FundJoinRequestDocument {
  fundId: Types.ObjectId | string;
  tenantId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  kycTemplateId?: Types.ObjectId | string;
  documents: SubmittedKycDocumentSubdocument[];
  status: FundJoinStatus;
  rejectionReason?: string;
  reviewedBy?: Types.ObjectId | string;
  reviewedAt?: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: Date;
  slotNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

const submittedKycDocumentSchema = new Schema<SubmittedKycDocumentSubdocument>(
  {
    requirementId: { type: String, required: true },
    documentType: { type: String, required: true },
    title: { type: String, required: true },
    frontSideKey: { type: String, required: true },
    backSideKey: { type: String },
    status: {
      type: String,
      enum: Object.values(DocumentVerificationStatus),
      default: DocumentVerificationStatus.PENDING,
    },
    rejectionReason: { type: String },
  },
  { _id: false },
);

const fundJoinRequestSchema = new Schema<FundJoinRequestDocument>(
  {
    fundId: {
      type: Schema.Types.ObjectId,
      ref: "ChitFund",
      required: true,
      index: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    kycTemplateId: {
      type: Schema.Types.ObjectId,
      ref: "TenantKycTemplate",
    },
    documents: {
      type: [submittedKycDocumentSchema],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(FundJoinStatus),
      default: FundJoinStatus.PENDING_VERIFICATION,
      index: true,
    },
    rejectionReason: {
      type: String,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
    },
    reviewedAt: {
      type: Date,
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    paidAt: {
      type: Date,
    },
    slotNumber: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "fundJoinRequests",
  },
);

fundJoinRequestSchema.index({ fundId: 1, userId: 1 }, { unique: true });
fundJoinRequestSchema.index({ tenantId: 1, status: 1, createdAt: -1 });

export type HydratedFundJoinRequestDocument =
  HydratedDocument<FundJoinRequestDocument>;

export const FundJoinRequestModel =
  models.FundJoinRequest ||
  model<FundJoinRequestDocument>("FundJoinRequest", fundJoinRequestSchema);
