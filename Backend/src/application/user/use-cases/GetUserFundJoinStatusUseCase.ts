import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IFundJoinRequestRepository } from "../../../domain/repositories/IFundJoinRequestRepository";
import { IChitFundMemberRepository } from "../../../domain/repositories/IChitFundMemberRepository";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { IGetUserFundJoinStatusUseCase } from "../../interface/user/IGetUserFundJoinStatusUseCase";
import { FundJoinStatusResponseDto } from "../dto/FundJoinRequestDto";
import { FundJoinRequestDtoMapper } from "../../mapper/FundJoinRequestDtoMapper";
import { FundJoinStatus } from "../../../domain/entities/FundJoinRequest";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class GetUserFundJoinStatusUseCase
  implements IGetUserFundJoinStatusUseCase
{
  constructor(
    @inject(TOKENS.FundJoinRequestRepository)
    private readonly _fundJoinRequestRepository: IFundJoinRequestRepository,

    @inject(TOKENS.ChitFundMemberRepository)
    private readonly _chitFundMemberRepository: IChitFundMemberRepository,

    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,
  ) {}

  public async execute(
    fundId: string,
    userId: string,
  ): Promise<FundJoinStatusResponseDto> {
    const fund = await this._chitFundRepository.findById(fundId);
    if (!fund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }

    // Check membership first
    const member = await this._chitFundMemberRepository.findByFundAndUser(
      fundId,
      userId,
    );

    const request = await this._fundJoinRequestRepository.findByFundAndUser(
      fundId,
      userId,
    );

    const initialAmountPaise = Math.round(fund.contributionAmount * 100);

    if (member) {
      return {
        fundId,
        hasRequest: true,
        status: FundJoinStatus.COMPLETED,
        documents: request ? FundJoinRequestDtoMapper.toDto(request).documents : [],
        canPayInitialAmount: false,
        isEnrolled: true,
        slotNumber: member.slotNumber,
        initialAmountPaise,
        request: request ? FundJoinRequestDtoMapper.toDto(request) : undefined,
      };
    }

    if (!request) {
      return {
        fundId,
        hasRequest: false,
        status: "NONE",
        documents: [],
        canPayInitialAmount: false,
        isEnrolled: false,
        initialAmountPaise,
      };
    }

    const canPay =
      request.status === FundJoinStatus.APPROVED ||
      request.status === FundJoinStatus.PAYMENT_PENDING;

    return {
      fundId,
      hasRequest: true,
      status: request.status,
      rejectionReason: request.rejectionReason,
      documents: FundJoinRequestDtoMapper.toDto(request).documents,
      canPayInitialAmount: canPay,
      isEnrolled: request.status === FundJoinStatus.COMPLETED,
      slotNumber: request.slotNumber,
      initialAmountPaise,
      request: FundJoinRequestDtoMapper.toDto(request),
    };
  }
}
