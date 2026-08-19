import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { MESSAGES } from '../../../shared/constants/messages'
import { RefreshTokenResponseDto } from "../dto/RefreshTokenDto";
import { ROLES } from "../../../shared/constants/roles";
import { IRefreshTokenUseCase } from "../../interface/auth/IRefreshTokenUseCase";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,

    @inject(TOKENS.JwtService)
    private readonly _jwtService: IJwtService
  ) {}   

  async execute(refreshToken: string): Promise<RefreshTokenResponseDto> {
    // if(!refreshToken){
    //     throw new UnauthorizedError(MESSAGES.AUTH.REFRESH_TOKEN_MISSING)
    // }

    // const payload = this._jwtService.verifyRefreshToken(refreshToken)
    // const user = await this._userRepository.findById(payload.id)

    // if(!user){
    //     throw new UnauthorizedError(MESSAGES.USER.NOT_FOUND)
    // }

    // if (!user.isActive && user.role !== ROLES.SUPER_ADMIN) {
    //   throw new UnauthorizedError(
    //     MESSAGES.AUTH.ACCOUNT_INACTIVE
    //   );
    // }
    
    // const accessToken = this._jwtService.generateAccessToken({
    //     id: user.id,
    //     email: user.email,
    //     role: user.role,
    // })

    const payload = this._jwtService.verifyRefreshToken(refreshToken);

const account =
  payload.role === ROLES.TENANT_ADMIN
    ? await this._tenantRepository.findById(payload.id)
    : await this._userRepository.findById(payload.id);

if (!account) {
  throw new UnauthorizedError(MESSAGES.USER.NOT_FOUND);
}

if (!account.isActive && payload.role !== ROLES.SUPER_ADMIN) {
  throw new UnauthorizedError(MESSAGES.AUTH.ACCOUNT_INACTIVE);
}

const accessToken = this._jwtService.generateAccessToken({
  id: account.id,
  email: account.email,
  role: payload.role,
});

    return {
        accessToken
    }
  }
}
