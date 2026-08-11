import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { LoginDto, LoginResponseDto } from "../dto/LoginDto";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { MESSAGES } from '../../../shared/constants/messages'
import { ROLES } from "../../../shared/constants/roles";
import { ILoginSuperAdminUseCase } from "../../interface/auth/ILoginSuperAdminUseCase";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { UserResponseMapper } from "../../mapper/UserResponseMapper";


@injectable()
export class LoginSuperAdminUseCase implements ILoginSuperAdminUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.BcryptService)
    private readonly _bcryptService: IBcryptService,
    @inject(TOKENS.JwtService)
    private readonly _jwtService: IJwtService
  ){}

  async execute(input: LoginDto): Promise<LoginResponseDto> {
    const user = await this._userRepository.findByEmailAndRole(
      input.email,
      ROLES.SUPER_ADMIN
    )

    if(!user){
      throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS)
    }

    if(!user.password){
      throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await this._bcryptService.comparePassword(
      input.password,
      user.password
    )

    if(!isPasswordValid){
      throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS)
    }

    const tokens = this._jwtService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    // return {
    //   user: {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role
    //   },
    //   tokens
    // }

    return {
      user: UserResponseMapper.toAuthUserDto(user),
      tokens
    }
  }
}