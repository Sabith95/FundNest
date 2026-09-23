import { CreateMultiDivisionChitFundDto } from "../../../tenant/chitfund/dto/CreateMultiDivisionChitFundDto";
import { ChitFundResponseDto } from "../../../tenant/chitfund/dto/ChitFundResponseDto";

export interface ICreateMultiDivisionChitFundUseCase {
  execute(
    tenantId: string,
    dto: CreateMultiDivisionChitFundDto,
  ): Promise<ChitFundResponseDto>;
}
