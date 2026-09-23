import { ChitFundResponseDto } from "../../../tenant/chitfund/dto/ChitFundResponseDto";

export interface IUnblockChitFundUseCase {
  execute(
    tenantId: string,
    fundId: string,
  ): Promise<ChitFundResponseDto>;
}
