import { ChitFundResponseDto } from "../../tenant/chitfund/dto/ChitFundResponseDto";

export interface IGetAvailableChitFundsUseCase {
  execute(userId: string): Promise<ChitFundResponseDto[]>;
}