import { User } from "../../../domain/entities/User";

export interface IUpdateUserStatusUseCase {
  execute(data: {
    userId: string;
    isActive: boolean;
  }): Promise<User>;
}