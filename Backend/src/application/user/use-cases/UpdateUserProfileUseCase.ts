import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../shared/constants/messages";
import {
  UpdateProfileDto,
  UpdateProfileResponseDto,
  toUserProfileDto,
} from "../dto/ProfileDto";


@injectable()
export class UpdateUserProfileUseCase {
    constructor(
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository
    ){}

    async execute(input: UpdateProfileDto): Promise<UpdateProfileResponseDto>{
     const user = await this._userRepository.findById(input.userId)   

      if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        const normalizedEmail = input.email?.toLocaleLowerCase().trim()
        const emailChanged = Boolean(normalizedEmail && normalizedEmail !== user.email)

        if(emailChanged && normalizedEmail){
            const existingUser = await this._userRepository.findByEmail(normalizedEmail)

            if(existingUser && existingUser.id !== user.id){
                throw new AppError(MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED,HTTP_STATUS.CONFLICT)
            }
        }

        const updatedUser = await this._userRepository.updateProfile(user.id,{
            name: input.name,
            email: normalizedEmail,
            phone: input.phone,
            address: input.address,
        })

        if (!updatedUser) {
        throw new AppError(MESSAGES.USER.PROFILE_UPDATE_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return {
            user: toUserProfileDto(updatedUser),
            emailChanged
        }
    }
}