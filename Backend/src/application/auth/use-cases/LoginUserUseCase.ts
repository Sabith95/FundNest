import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { LoginDto, LoginResponseDto } from "../dto/LoginDto";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from '../../../shared/constants/httpStatus'
import { MESSAGES } from '../../../shared/constants/messages'
import { ROLES } from "../../../shared/constants/roles";

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TOKENS.BcryptService)
    private readonly bcryptService: IBcryptService,
    @inject(TOKENS.JwtService)
    private readonly jwtService: IJwtService
  ) {}

  async execute(input: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmailAndRole(
      input.email,
      ROLES.USER
    );

    if (!user || !user.password) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new AppError(MESSAGES.AUTH.ACCOUNT_INACTIVE, HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.isEmailVerified) {
      throw new AppError(MESSAGES.AUTH.EMAIL_NOT_VERIFIED, HTTP_STATUS.UNAUTHORIZED);
    }

    const isPasswordValid = await this.bcryptService.comparePassword(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const tokens = this.jwtService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }
}