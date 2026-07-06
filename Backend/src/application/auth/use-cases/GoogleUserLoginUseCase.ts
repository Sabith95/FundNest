import {inject, injectable} from 'tsyringe'
import { TOKENS } from '../../../shared/tokens'
import { GoogleLoginDto, GoogleResponseDto } from '../dto/GoogleLoginDto'
import { IUserRepository } from '../../../domain/repositories/IUserRepository'
import { IJwtService } from '../../../infrastructure/auth/interfaces/IJwtService'
import { IGoogleAuthService } from '../../../infrastructure/auth/interfaces/IGoogleAuthService'
import { AppError } from '../../../shared/errors/AppError'
import { HTTP_STATUS } from '../../../shared/constants/httpStatus'
import { MESSAGES } from '../../../shared/constants/messages'
import { ROLES } from '../../../shared/constants/roles'

@injectable()
export class GoogleUserLoginUseCase {
    constructor (
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TOKENS.GoogleAuthService)
        private readonly _googleAuthService: IGoogleAuthService,
        @inject(TOKENS.JwtService)
        private readonly _jwtService: IJwtService
    ){}

    async execute(input: GoogleLoginDto): Promise<GoogleResponseDto> {
        const googleUser = await this._googleAuthService.verifyIdToken(input.idToken)

        let user = await this._userRepository.findByGoogleId(googleUser.googleId)

        if(!user){
            const existingUserEmail = await this._userRepository.findByEmail(googleUser.email)

            if(existingUserEmail && existingUserEmail.authProvider !== "GOOGLE"){
                throw new AppError(MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED_WITH_PASSWORD, HTTP_STATUS.CONFLICT)
            }

            user = await this._userRepository.create({
                name: googleUser.name,
                email: googleUser.email,
                role: ROLES.USER,
                authProvider: "GOOGLE",
                googleId: googleUser.googleId,
                isEmailVerified: true,
                isActive: true,
                profile: {
                kycStatus: "PENDING",
                },
            })
        }

        if(!user.isActive){
            throw new AppError(MESSAGES.AUTH.ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN)
        }

        const tokens = this._jwtService.generateTokenPair({
            id: user.id,
            email: user.email,
            role: user.role,
        })

        return {
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            tokens
        }


    }
}