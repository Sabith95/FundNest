import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from '../../../shared/constants/httpStatus'
import { MESSAGES } from '../../../shared/constants/messages'
import { RefreshTokenResponseDto } from "../dto/RefreshTokenDto";
import { ROLES } from "../../../shared/constants/roles";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.JwtService)
    private readonly _jwtService: IJwtService
  ) {}   

  async execute(refreshToken: string): Promise<RefreshTokenResponseDto> {
    if(!refreshToken){
        throw new AppError(MESSAGES.AUTH.REFRESH_TOKEN_MISSING, HTTP_STATUS.UNAUTHORIZED)
    }

    const payload = this._jwtService.verifyRefreshToken(refreshToken)
    const user = await this._userRepository.findById(payload.id)

    if(!user){
        throw new AppError(MESSAGES.USER.NOT_FOUND, HTTP_STATUS.UNAUTHORIZED)
    }

    if (!user.isActive && user.role !== ROLES.SUPER_ADMIN) {
      throw new AppError(
        MESSAGES.AUTH.ACCOUNT_INACTIVE,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    
    const accessToken = this._jwtService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
    })

    return {
        accessToken
    }
  }
}
