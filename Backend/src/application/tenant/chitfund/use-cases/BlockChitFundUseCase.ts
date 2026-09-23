import { inject, injectable } from "tsyringe";

import { IChitFundRepository } from "../../../../domain/repositories/IChitFundRepository";
import {TOKENS} from "../../../../shared/tokens"
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ChitFundDtoMapper } from "../../../mapper/ChitFundDtoMapper";
import { ChitFundResponseDto } from "../dto/ChitFundResponseDto";
import { IBlockChitFundUseCase } from "../../../interface/tenant/chitfund/IBlockChitFundUseCase";
import { MESSAGES } from "../../../../shared/constants/messages";

@injectable()
export class BlockChitFundUseCase implements IBlockChitFundUseCase {
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

    fund.block();

    const updatedFund = await this._chitFundRepository.updateStatus(
      fundId,
      tenantId,
      false,
    );

    if (!updatedFund) {
      throw new NotFoundError(MESSAGES.FUND.NOT_FOUND);
    }

    return ChitFundDtoMapper.toDto(updatedFund);
  }
}
