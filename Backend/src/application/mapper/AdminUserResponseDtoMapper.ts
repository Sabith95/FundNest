import { User } from "../../domain/entities/User";
import { AdminUsersResponseDto } from "../admin/dto/AdminUsersResponseDto";

export class AdminUserResponseDtoMapper {
  static toDto(user: User): AdminUsersResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  static toDtoList(users: User[]): AdminUsersResponseDto[] {
    return users.map((user) => this.toDto(user));
  }
}
