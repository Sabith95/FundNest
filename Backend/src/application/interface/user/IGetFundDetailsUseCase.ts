import { FundDetailsDto } from "../../user/dto/FundDetailsDto";

export interface IGetFundDetailsUseCase {
  execute(fundId: string, userId?: string): Promise<FundDetailsDto>;
}
