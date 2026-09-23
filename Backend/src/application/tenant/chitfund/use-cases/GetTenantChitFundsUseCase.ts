import { inject, injectable } from "tsyringe";

import { IChitFundRepository } from "../../../../domain/repositories/IChitFundRepository";
import { TOKENS } from "../../../../shared/tokens";
import { ChitFundDtoMapper } from "../../../mapper/ChitFundDtoMapper";
import { ChitFundResponseDto } from "../dto/ChitFundResponseDto";
import { IGetTenantChitFundsUseCase } from "../../../interface/tenant/chitfund/IGetTenantChitFundsUseCase";

@injectable()
export class GetTenantChitFundsUseCase implements IGetTenantChitFundsUseCase {
  constructor(
    @inject(TOKENS.ChitFundRepository)
    private readonly _chitFundRepository: IChitFundRepository,
  ) {}

  async execute(tenantId: string): Promise<ChitFundResponseDto[]> {
    const funds = await this._chitFundRepository.findByTenantId(tenantId);
    return ChitFundDtoMapper.toDtoList(funds);
  }
}
