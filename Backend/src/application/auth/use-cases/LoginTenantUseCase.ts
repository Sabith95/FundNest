import { injectable, inject } from "tsyringe";
import { MESSAGES } from "../../../shared/constants/messages";
import { ROLES } from "../../../shared/constants/roles";
import { TOKENS } from "../../../shared/tokens";
import { LoginTenantDto, LoginTenantResponseDto } from "../dto/LoginTenantDto";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";
import { TenantResponseMapper } from "../../mapper/TenantResponseMapper";
import { ILoginTenantUseCase } from "../../interface/auth/ILoginTenantUseCase";

@injectable()
export class LoginTenantUseCase implements ILoginTenantUseCase {
  constructor(
    @inject(TOKENS.TenantRepository)
    private readonly _tenantRepository: ITenantRepository,
    @inject(TOKENS.BcryptService)
    private readonly _bcryptService: IBcryptService,
    @inject(TOKENS.JwtService)
    private readonly _jwtService: IJwtService,
  ) {}

  async execute(input: LoginTenantDto): Promise<LoginTenantResponseDto> {
    const tenant = await this._tenantRepository.findByEmail(input.email);

    if (!tenant || !tenant.password) {
      throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this._bcryptService.comparePassword(
      input.password,
      tenant.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!tenant.isEmailVerified) {
      throw new UnauthorizedError(MESSAGES.AUTH.EMAIL_NOT_VERIFIED);
    }

    if (!tenant.isActive) {
      throw new ForbiddenError(MESSAGES.AUTH.ACCOUNT_INACTIVE);
    }

    const tokens = this._jwtService.generateTokenPair({
      id: tenant.id,
      email: tenant.email,
      role: ROLES.TENANT_ADMIN,
    });

    return {
      tenant: TenantResponseMapper.toLoginTenant(tenant),
      tokens,
    };
  }
}
