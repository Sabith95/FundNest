import { CreateFundJoinCheckoutResponseDto } from "../../user/dto/FundJoinRequestDto";

export interface ICreateFundJoinCheckoutUseCase {
  execute(
    fundId: string,
    userId: string,
  ): Promise<CreateFundJoinCheckoutResponseDto>;
}
