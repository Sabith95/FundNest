import { ChitFundResponseDto } from "../../../tenant/chitfund/dto/ChitFundResponseDto";

export interface IBlockChitFundUseCase {
  execute(
    tenantId: string,
    fundId: string,
  ): Promise<ChitFundResponseDto>;
}
