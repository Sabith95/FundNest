import { RegisterTenantDto } from "../../auth/dto/RegisterTenantDto";
import { RegisterTenantResponseDto } from "../../auth/dto/RegisterTenantDto";

export interface IRegisterTenantUseCase {
  execute(input: RegisterTenantDto): Promise<RegisterTenantResponseDto>;
}
