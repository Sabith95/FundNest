import { Types } from "mongoose";
import { FundJoinRequest } from "../../../domain/entities/FundJoinRequest";
import { FundJoinRequestDocument } from "../models/FundJoinRequestModel";

export type FundJoinRequestRecord = FundJoinRequestDocument & {
  _id: Types.ObjectId;
};

export class FundJoinRequestPersistenceMapper {
  static toEntity(doc: FundJoinRequestRecord): FundJoinRequest {
    return FundJoinRequest.create({
      id: doc._id.toString(),
      fundId: doc.fundId.toString(),
      tenantId: doc.tenantId.toString(),
      userId: doc.userId.toString(),
      kycTemplateId: doc.kycTemplateId?.toString(),
      documents: (doc.documents || []).map((d) => ({
        requirementId: d.requirementId,
        documentType: d.documentType,
        title: d.title,
        frontSideKey: d.frontSideKey,
        backSideKey: d.backSideKey,
        status: d.status,
        rejectionReason: d.rejectionReason,
      })),
      status: doc.status,
      rejectionReason: doc.rejectionReason,
      reviewedBy: doc.reviewedBy?.toString(),
      reviewedAt: doc.reviewedAt,
      razorpayOrderId: doc.razorpayOrderId,
      razorpayPaymentId: doc.razorpayPaymentId,
      paidAt: doc.paidAt,
      slotNumber: doc.slotNumber,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: FundJoinRequest): Partial<FundJoinRequestDocument> {
    return {
      fundId: new Types.ObjectId(entity.fundId),
      tenantId: new Types.ObjectId(entity.tenantId),
      userId: new Types.ObjectId(entity.userId),
      kycTemplateId: entity.kycTemplateId
        ? new Types.ObjectId(entity.kycTemplateId)
        : undefined,
      documents: entity.documents.map((d) => ({
        requirementId: d.requirementId,
        documentType: d.documentType,
        title: d.title,
        frontSideKey: d.frontSideKey,
        backSideKey: d.backSideKey,
        status: d.status,
        rejectionReason: d.rejectionReason,
      })),
      status: entity.status,
      rejectionReason: entity.rejectionReason,
      reviewedBy: entity.reviewedBy
        ? new Types.ObjectId(entity.reviewedBy)
        : undefined,
      reviewedAt: entity.reviewedAt,
      razorpayOrderId: entity.razorpayOrderId,
      razorpayPaymentId: entity.razorpayPaymentId,
      paidAt: entity.paidAt,
      slotNumber: entity.slotNumber,
    };
  }
}
