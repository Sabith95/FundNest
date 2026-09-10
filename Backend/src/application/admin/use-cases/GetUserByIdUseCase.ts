import { inject, injectable } from "tsyringe";
import { IGetUserByIdUseCase } from "../../interface/admin/IGetUserByIdUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { TOKENS } from "../../../shared/tokens";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this._userRepository.findById(id);

    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }

    return user;
  }
}
