import { injectable, inject } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from '../../../shared/constants/httpStatus'
import { MESSAGES } from '../../../shared/constants/messages'
import { ROLES } from "../../../shared/constants/roles";
import { TOKENS } from "../../../shared/tokens";
import { LoginTenantDto, LoginTenantResponseDto } from "../dto/LoginTenantDto";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { ITenantRepository } from "../../../domain/repositories/ITenantRepository";

@injectable()
export class LoginTenantUseCase {
    constructor(
        @inject(TOKENS.TenantRepository)
        private readonly _tenantRepository: ITenantRepository,
        @inject(TOKENS.BcryptService)
        private readonly _bcryptService: IBcryptService,
        @inject(TOKENS.JwtService)
        private readonly _jwtService: IJwtService
    ){ }

    async execute(input: LoginTenantDto): Promise<LoginTenantResponseDto> {
        const tenant = await this._tenantRepository.findByEmail(input.email)

        if(!tenant || !tenant.password){
            throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED)
        }

        const isPasswordValid =
        await this._bcryptService.comparePassword(
            input.password,
            tenant.password
        );

        if (!isPasswordValid) {
        throw new AppError(
            MESSAGES.AUTH.INVALID_CREDENTIALS,
            HTTP_STATUS.UNAUTHORIZED
        );
        }

        if (!tenant.isEmailVerified) {
        throw new AppError(
            MESSAGES.AUTH.EMAIL_NOT_VERIFIED,
            HTTP_STATUS.FORBIDDEN
        );
        }

        if (!tenant.isActive) {
        throw new AppError(
            MESSAGES.AUTH.ACCOUNT_INACTIVE,
            HTTP_STATUS.FORBIDDEN
        );
        }

        const tokens = this._jwtService.generateTokenPair({
        id: tenant.id,
        email: tenant.email,
        role: ROLES.TENANT_ADMIN,
        });

        return {
        tenant: {
            id: tenant.id,
            companyName: tenant.companyName,
            ownerName: tenant.ownerName,
            email: tenant.email,
            status: tenant.status,
            onboardingStep: tenant.onboardingStep,
        },
        tokens,
        };
    }
}