import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IFundJoinRequestRepository } from "../../../domain/repositories/IFundJoinRequestRepository";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailService } from "../../../domain/interface/notification/IEmailService";
import {
  IReviewFundJoinRequestUseCase,
  ReviewFundJoinRequestInputDto,
} from "../../interface/tenant/IReviewFundJoinRequestUseCase";
import { FundJoinRequestResponseDto } from "../../user/dto/FundJoinRequestDto";
import { FundJoinRequestDtoMapper } from "../../mapper/FundJoinRequestDtoMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { logger } from "../../../shared/logger";

@injectable()
export class ReviewFundJoinRequestUseCase
  implements IReviewFundJoinRequestUseCase
{
  constructor(
    @inject(TOKENS.FundJoinRequestRepository)
    private readonly _fundJoinRequestRepository: IFundJoinRequestRepository,

    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,

    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.EmailService)
    private readonly _emailService: IEmailService,
  ) {}

  public async execute(
    tenantId: string,
    requestId: string,
    reviewerId: string,
    input: ReviewFundJoinRequestInputDto,
  ): Promise<FundJoinRequestResponseDto> {
    const request = await this._fundJoinRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundError("Fund join request not found");
    }

    if (request.tenantId !== tenantId) {
      throw new ForbiddenError(
        "You are not authorized to review requests for another organization",
      );
    }

    const [user, fund] = await Promise.all([
      this._userRepository.findById(request.userId),
      this._chitFundRepository.findById(request.fundId),
    ]);

    if (!user) {
      throw new NotFoundError("Applicant user account not found");
    }
    if (!fund) {
      throw new NotFoundError("Associated chit fund not found");
    }

    if (input.decision === "APPROVED") {
      request.approve(reviewerId);
      const saved = await this._fundJoinRequestRepository.updateRequest(request);

      // Asynchronously trigger approval email
      this._emailService
        .sendFundJoinKycApprovedEmail(
          user.email,
          user.name,
          fund.name,
          fund.contributionAmount,
          fund.id,
        )
        .catch((err) => {
          logger.error(
            `Failed to send KYC approval email to ${user.email}: ${err.message}`,
          );
        });

      return FundJoinRequestDtoMapper.toDto(saved);
    } else if (input.decision === "REJECTED") {
      if (!input.rejectionReason?.trim()) {
        throw new BadRequestError(
          "A clear rejection reason must be provided to the applicant",
        );
      }

      request.reject(
        reviewerId,
        input.rejectionReason.trim(),
        input.documentReviews,
      );
      const saved = await this._fundJoinRequestRepository.updateRequest(request);

      // Asynchronously trigger rejection email
      this._emailService
        .sendFundJoinKycRejectedEmail(
          user.email,
          user.name,
          fund.name,
          input.rejectionReason.trim(),
          fund.id,
        )
        .catch((err) => {
          logger.error(
            `Failed to send KYC rejection email to ${user.email}: ${err.message}`,
          );
        });

      return FundJoinRequestDtoMapper.toDto(saved);
    } else {
      throw new BadRequestError("Invalid decision. Must be APPROVED or REJECTED");
    }
  }
}
