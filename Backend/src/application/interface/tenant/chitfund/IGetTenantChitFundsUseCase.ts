import { ChitFundResponseDto } from "../../../tenant/chitfund/dto/ChitFundResponseDto";

export interface IGetTenantChitFundsUseCase {
  execute(tenantId: string): Promise<ChitFundResponseDto[]>;
}
