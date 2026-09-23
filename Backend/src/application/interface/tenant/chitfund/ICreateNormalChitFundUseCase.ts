import { CreateNormalChitFundDto } from "../../../tenant/chitfund/dto/CreateNormalChitFundDto";
import { ChitFundResponseDto } from "../../../tenant/chitfund/dto/ChitFundResponseDto";

export interface ICreateNormalChitFundUseCase {
  execute(
    tenantId: string,
    dto: CreateNormalChitFundDto,
  ): Promise<ChitFundResponseDto>;
}
