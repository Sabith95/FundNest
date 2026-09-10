import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IBcryptService } from "../../../infrastructure/auth/interfaces/IBcryptService";
import {
  RegisterUserDto,
  RegisterUserResponseDto,
} from "../dto/RegisterUserDto";
import { IEmailService } from "../../../infrastructure/notification/interfaces/IEmailService";
import { IOtpService } from "../../../infrastructure/cache/interfaces/IOtpService";
import { generateOtp } from "../../../shared/utils/generateOtp";
import { ROLES } from "../../../shared/constants/roles";
import { MESSAGES } from "../../../shared/constants/messages";
import { OtpPurpose } from "../../../shared/constants/enums/OtpPurpose";
import { IRegisterUserUseCase } from "../../interface/auth/IRegisterUseCase";
import { ConflictError } from "../../../shared/errors/ConflictError";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.BcryptService)
    private readonly _bcryptService: IBcryptService,
    @inject(TOKENS.EmailService)
    private readonly _emailService: IEmailService,
    @inject(TOKENS.OtpService)
    private readonly _otpService: IOtpService,
  ) {}

  async execute(input: RegisterUserDto): Promise<RegisterUserResponseDto> {
    const email = input.email.toLocaleLowerCase().trim();
    const existingUser = await this._userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError(MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED);
    }

    const hashedPassword = await this._bcryptService.hashPassword(
      input.password,
    );

    await this._otpService.storePendingUserRegistration({
      name: input.name,
      email: email,
      phone: input.phone,
      password: hashedPassword,
      address: input.address,
      role: ROLES.USER,
      authProvider: "LOCAL",
    });

    const otp = generateOtp();

    await this._otpService.storeOtp({
      email,
      otp,
      purpose: OtpPurpose.USER_REGISTRATION,
    });

    await this._emailService.sendOtp(email, otp);

    return {
      verificationRequired: true,
    };
  }
}
