import { DocumentVerificationStatus } from "../../../domain/entities/FundJoinRequest";
import { FundJoinRequestResponseDto } from "../../user/dto/FundJoinRequestDto";

export interface ReviewDocumentItemDto {
  requirementId: string;
  status: DocumentVerificationStatus;
  rejectionReason?: string;
}

export interface ReviewFundJoinRequestInputDto {
  decision: "APPROVED" | "REJECTED";
  rejectionReason?: string;
  documentReviews?: ReviewDocumentItemDto[];
}

export interface IReviewFundJoinRequestUseCase {
  execute(
    tenantId: string,
    requestId: string,
    reviewerId: string,
    input: ReviewFundJoinRequestInputDto,
  ): Promise<FundJoinRequestResponseDto>;
}
