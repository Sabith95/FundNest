import { User } from "../../../domain/entities/User";

export interface IGetUserByIdUseCase {
  execute(id: string): Promise<User>;
}
