import { FundJoinRequest } from "../../domain/entities/FundJoinRequest";
import { FundJoinRequestResponseDto } from "../user/dto/FundJoinRequestDto";

export class FundJoinRequestDtoMapper {
  static toDto(entity: FundJoinRequest): FundJoinRequestResponseDto {
    return {
      id: entity.id,
      fundId: entity.fundId,
      tenantId: entity.tenantId,
      userId: entity.userId,
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
      slotNumber: entity.slotNumber,
      razorpayOrderId: entity.razorpayOrderId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toDtoList(list: FundJoinRequest[]): FundJoinRequestResponseDto[] {
    return list.map((item) => this.toDto(item));
  }
}
