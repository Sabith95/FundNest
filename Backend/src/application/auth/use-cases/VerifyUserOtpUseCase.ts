import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { verifyOtpDto, verifyOtpResponseDto } from "../dto/verifyOtpDto";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { IVerifyUserOtpUseCase } from "../../interface/auth/IVerifyUserOtpUseCase";
import { BadRequestError } from "../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../shared/constants/messages";

@injectable()
export class VerifyUserOtpUseCase implements IVerifyUserOtpUseCase {
    constructor (
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TOKENS.OtpService)
        private readonly _otpService: IOtpService
    ){}
    

    async execute(input: verifyOtpDto): Promise<verifyOtpResponseDto> {
         await this._otpService.verifyOtp({
            email: input.email,
            otp: input.otp,
            purpose: OtpPurpose.USER_REGISTRATION
        })

        const pendingRegistration = await this._otpService.getPendingUserRegistration(input.email)

        if(!pendingRegistration){
            throw new BadRequestError(MESSAGES.AUTH.REGISTRATION_EXPIRED)
        }

        const user = await this._userRepository.create({
            name: pendingRegistration.name,
            email: pendingRegistration.email,
            phone: pendingRegistration.phone,
            password: pendingRegistration.password,
            role: pendingRegistration.role,
            authProvider: pendingRegistration.authProvider,
            isActive: true,
            isEmailVerified: true,
            profile: {
                address: pendingRegistration.address,
                kycStatus: "PENDING"
            }
        });       


        await this._otpService.deletePendingUserRegistration(input.email)

        return {
            email: user.email,
            isEmailVerified: true
        }
    }

}