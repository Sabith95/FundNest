import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import { AppError } from "../../../shared/errors/AppError";
import { RegisterUserDto, RegisterUserResponseDto } from "../dto/RegisterUserDto";
import { IEmailService } from "../../../infrastructure/notification/interfaces/IEmailService";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { generateOtp } from "../../../shared/utils/generateOtp";
import { ROLES } from "../../../shared/constants/roles";
import { HTTP_STATUS } from '../../../shared/constants/httpStatus'
import { MESSAGES } from '../../../shared/constants/messages'
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";


@injectable()
export class RegisterUserUseCase {
    constructor(
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TOKENS.BcryptService)
        private readonly _bcryptService: IBcryptService,
        @inject(TOKENS.EmailService)
        private readonly _emailService: IEmailService,
        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService
    ){}

    async execute(input: RegisterUserDto): Promise<RegisterUserResponseDto> {
        const existingUser = await this._userRepository.findByEmail(input.email)

        if(existingUser){
            throw new AppError(MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED, HTTP_STATUS.CONFLICT)
        }

        const hashedPassword = await this._bcryptService.hashPassword(input.password)

        

        const user = await this._userRepository.create({
            name:input.name,
            email: input.email,
            phone: input.phone,
            password: hashedPassword,
            role: ROLES.USER,
            authProvider: "LOCAL",
            isActive: true,
            isEmailVerified: false,
            profile: {
            address: input.address,
            kycStatus: "PENDING",
      },
        })

        const otp = generateOtp()

        await this._otpService.storeOtp({
            userId: user.id,
            email: user.email,
            otp,
            purpose: OtpPurpose.USER_REGISTRATION
        })

        await this._emailService.sendOtp(user.email, otp)

        return {
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            profile: user.profile,
      },
      verificationRequired: true,
        }
    }
}