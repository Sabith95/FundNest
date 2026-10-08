import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IFundJoinRequestRepository } from "../../../domain/repositories/IFundJoinRequestRepository";
import { IReuploadFundKycUseCase } from "../../interface/user/IReuploadFundKycUseCase";
import {
  FundJoinRequestResponseDto,
  ReuploadFundKycInputDto,
} from "../dto/FundJoinRequestDto";
import {
  DocumentVerificationStatus,
  FundJoinStatus,
} from "../../../domain/entities/FundJoinRequest";
import { FundJoinRequestDtoMapper } from "../../mapper/FundJoinRequestDtoMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";

@injectable()
export class ReuploadFundKycUseCase implements IReuploadFundKycUseCase {
  constructor(
    @inject(TOKENS.FundJoinRequestRepository)
    private readonly _fundJoinRequestRepository: IFundJoinRequestRepository,
  ) {}

  public async execute(
    fundId: string,
    userId: string,
    input: ReuploadFundKycInputDto,
  ): Promise<FundJoinRequestResponseDto> {
    const existing = await this._fundJoinRequestRepository.findByFundAndUser(
      fundId,
      userId,
    );

    if (!existing) {
      throw new NotFoundError("No join request found for this fund");
    }

    if (existing.status !== FundJoinStatus.REJECTED) {
      throw new BadRequestError(
        `Cannot re-upload documents when request status is ${existing.status}. Re-upload is only permitted for rejected requests.`,
      );
    }

    if (!input.documents || input.documents.length === 0) {
      throw new BadRequestError("At least one document must be re-uploaded");
    }

    const updatedDocuments = input.documents.map((d) => ({
      requirementId: d.requirementId,
      documentType: d.documentType,
      title: d.title,
      frontSideKey: d.frontSideKey,
      backSideKey: d.backSideKey,
      status: DocumentVerificationStatus.PENDING,
    }));

    existing.reupload(updatedDocuments);
    const saved = await this._fundJoinRequestRepository.updateRequest(existing);

    return FundJoinRequestDtoMapper.toDto(saved);
  }
}
