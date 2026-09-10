import { inject, injectable } from "tsyringe";
import { IUpdateUserStatusUseCase } from "../../interface/admin/IUpdateUserStatus";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(data: { userId: string; isActive: boolean }): Promise<User> {
    const user = await this._userRepository.updateActiveStatus(
      data.userId,
      data.isActive,
    );

    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }

    return user;
  }
}
