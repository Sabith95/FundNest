import { inject, injectable } from "tsyringe";

import { IChitFundRepository } from "../../../../domain/repositories/IChitFundRepository";
import { TOKENS } from "../../../../shared/tokens";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ChitFundDtoMapper } from "../../../mapper/ChitFundDtoMapper";
import { ChitFundResponseDto } from "../dto/ChitFundResponseDto";
import { IUnblockChitFundUseCase } from "../../../interface/tenant/chitfund/IUnblockChitFundUseCase";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class UnblockChitFundUseCase implements IUnblockChitFundUseCase {
  constructor(
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,
  ) {}

  async execute(
    tenantId: string,
    fundId: string,
  ): Promise<ChitFundResponseDto> {
    const fund = await this._chitFundRepository.findByIdAndTenantId(
      fundId,
      tenantId,
    );

    if (!fund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }

    fund.unblock();

    const updatedFund = await this._chitFundRepository.updateStatus(
      fundId,
      tenantId,
      true,
    );

    if (!updatedFund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }

    return ChitFundDtoMapper.toDto(updatedFund);
  }
}
