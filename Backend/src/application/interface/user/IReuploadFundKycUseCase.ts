import {
  FundJoinRequestResponseDto,
  ReuploadFundKycInputDto,
} from "../../user/dto/FundJoinRequestDto";

export interface IReuploadFundKycUseCase {
  execute(
    fundId: string,
    userId: string,
    input: ReuploadFundKycInputDto,
  ): Promise<FundJoinRequestResponseDto>;
}
