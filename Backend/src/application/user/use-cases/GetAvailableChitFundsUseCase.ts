import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IChitFundRepository } from "../../../domain/repositories/IChitFundRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IGetAvailableChitFundsUseCase } from "../../interface/user/IGetAvailableChitFundsUseCase";
import { ChitFundResponseDto } from "../../tenant/chitfund/dto/ChitFundResponseDto";
import { ChitFundDtoMapper } from "../../mapper/ChitFundDtoMapper";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class GetAvailableChitFundsUseCase implements IGetAvailableChitFundsUseCase {
  constructor(
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,

    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(userId: string): Promise<ChitFundResponseDto[]> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    if (!user.isActive) {
      throw new ForbiddenError(MESSAGES.AUTH.ACCOUNT_INACTIVE);
    }

    const candidateFunds = await this._chitFundRepository.findAvailableFunds();

    const now = new Date();

    const joinableFunds = candidateFunds.filter((fund) => {
      const isActive = fund.isActive === true;
      const hasAvailableSlots = fund.currentMembersCount < fund.totalMembers;
      const isEnrollmentOpen =
        new Date(fund.startDate).getTime() > now.getTime();

      return isActive && hasAvailableSlots && isEnrollmentOpen;
    });

    return ChitFundDtoMapper.toDtoList(joinableFunds);
  }
}
