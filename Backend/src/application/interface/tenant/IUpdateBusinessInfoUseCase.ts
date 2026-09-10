import { UpdateBusinessInfoDto } from "../../tenant/dto/UpdateBusinessInfoDto";
import { UpdateBusinessInfoResponseDto } from "../../tenant/dto/UpdateBusinessInfoResponseDto";

export interface IUpdateBusinessInfoUseCase {
  execute(
    tenantId: string,
    input: UpdateBusinessInfoDto,
  ): Promise<UpdateBusinessInfoResponseDto>;
}
