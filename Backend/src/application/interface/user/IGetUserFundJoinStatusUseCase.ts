import { FundJoinStatusResponseDto } from "../../user/dto/FundJoinRequestDto";

export interface IGetUserFundJoinStatusUseCase {
  execute(fundId: string, userId: string): Promise<FundJoinStatusResponseDto>;
}
