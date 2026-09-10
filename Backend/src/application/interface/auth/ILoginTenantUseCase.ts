import {
  LoginTenantDto,
  LoginTenantResponseDto,
} from "../../auth/dto/LoginTenantDto";

export interface ILoginTenantUseCase {
  execute(input: LoginTenantDto): Promise<LoginTenantResponseDto>;
}
