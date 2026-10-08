import {
  FundJoinRequestResponseDto,
  SubmitFundJoinRequestInputDto,
} from "../../user/dto/FundJoinRequestDto";

export interface ISubmitFundJoinRequestUseCase {
  execute(
    fundId: string,
    userId: string,
    input: SubmitFundJoinRequestInputDto,
  ): Promise<FundJoinRequestResponseDto>;
}
