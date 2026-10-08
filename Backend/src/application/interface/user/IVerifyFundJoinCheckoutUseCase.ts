import {
  VerifyFundJoinCheckoutInputDto,
  VerifyFundJoinCheckoutResponseDto,
} from "../../user/dto/FundJoinRequestDto";

export interface IVerifyFundJoinCheckoutUseCase {
  execute(
    userId: string,
    input: VerifyFundJoinCheckoutInputDto,
  ): Promise<VerifyFundJoinCheckoutResponseDto>;
}
