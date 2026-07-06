import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../shared/constants/messages";
import {
  ChangePasswordDto,
  ChangePasswordResponseDto,
} from "../dto/ProfileDto";

@injectable()
export class ChangeUserPasswordUseCase {
    constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.BcryptService)
    private readonly _bcryptService: IBcryptService
  ) {}

  async execute(input: ChangePasswordDto): Promise<ChangePasswordResponseDto> {
    const user = await this._userRepository.findById(input.userId)

    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (user.authProvider !== "LOCAL" || !user.password) {
      throw new AppError(
        MESSAGES.AUTH.PASSWORD_CHANGE_NOT_ALLOWED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const isCurrentPasswordValid = await this._bcryptService.comparePassword(
        input.currentPassword,
        user.password
    )

    if (!isCurrentPasswordValid) {
      throw new AppError(MESSAGES.AUTH.CURRENT_PASSWORD_INCORRECT, HTTP_STATUS.BAD_REQUEST);
    }

    const isSamePassword = await this._bcryptService.comparePassword(
        input.newPassword,
        user.password
    )

    if (isSamePassword) {
      throw new AppError(
        MESSAGES.AUTH.NEW_PASSWORD_MUST_BE_DIFFERENT,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hashedPassword = await this._bcryptService.hashPassword(input.newPassword);

    await this._userRepository.updatePassword(user.id, hashedPassword);

    return {
      passwordChanged: true,
    };
  }
}