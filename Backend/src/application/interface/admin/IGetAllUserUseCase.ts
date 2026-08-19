import { AdminUsersResponseDto } from "../../admin/dto/AdminUsersResponseDto";
import { GetAllUsersRequestDto } from "../../admin/dto/GetAllUsersRequestDto";

export interface IGetAllTenantsUseCase {
  execute(
    data: GetAllUsersRequestDto
  ): Promise<{
    users: AdminUsersResponseDto[];
    total: number;
    page: number;
    limit: number;
  }>;
}