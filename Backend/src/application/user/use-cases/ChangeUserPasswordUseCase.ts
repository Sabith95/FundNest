import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { MESSAGES } from "../../../shared/constants/messages";
import {
  ChangePasswordDto,
  ChangePasswordResponseDto,
} from "../dto/ProfileDto";
import { IChangeUserPasswordUseCase } from "../../interface/user/IChangeUserPasswordUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { BadRequestError } from "../../../shared/errors/BadRequestError";


@injectable()
export class ChangeUserPasswordUseCase implements IChangeUserPasswordUseCase {
    constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.BcryptService)
    private readonly _bcryptService: IBcryptService
  ) {}

  async execute(input: ChangePasswordDto): Promise<ChangePasswordResponseDto> {
    const user = await this._userRepository.findById(input.userId)

    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }

    if (user.authProvider !== "LOCAL" || !user.password) {
      throw new BadRequestError(
        MESSAGES.AUTH.PASSWORD_CHANGE_NOT_ALLOWED
      );
    }

    const isCurrentPasswordValid = await this._bcryptService.comparePassword(
        input.currentPassword,
        user.password
    )

    if (!isCurrentPasswordValid) {
      throw new BadRequestError(MESSAGES.AUTH.CURRENT_PASSWORD_INCORRECT);
    }

    const isSamePassword = await this._bcryptService.comparePassword(
        input.newPassword,
        user.password
    )

    if (isSamePassword) {
      throw new BadRequestError(
        MESSAGES.AUTH.NEW_PASSWORD_MUST_BE_DIFFERENT
      );
    }

    const hashedPassword = await this._bcryptService.hashPassword(input.newPassword);

    await this._userRepository.updatePassword(user.id, hashedPassword);

    return {
      passwordChanged: true,
    };
  }
}