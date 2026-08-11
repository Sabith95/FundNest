import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { MESSAGES } from "../../../shared/constants/messages";
import {
  UpdateProfileDto,
  UpdateProfileResponseDto,
} from "../dto/ProfileDto";
import { IUpdateUserProfileUseCase } from "../../interface/user/IUpdateUserProfileUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { InternalServerError } from "../../../shared/errors/InternalServerError";
import { UserResponseMapper } from "../../mapper/UserResponseMapper";

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    constructor(
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository
    ){}

    async execute(input: UpdateProfileDto): Promise<UpdateProfileResponseDto>{
     const user = await this._userRepository.findById(input.userId)   

      if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
        }

        const normalizedEmail = input.email?.toLocaleLowerCase().trim()
        const emailChanged = Boolean(normalizedEmail && normalizedEmail !== user.email)

        if(emailChanged && normalizedEmail){
            const existingUser = await this._userRepository.findByEmail(normalizedEmail)

            if(existingUser && existingUser.id !== user.id){
                throw new ConflictError(MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED)
            }
        }

        const updatedUser = await this._userRepository.updateProfile(user.id,{
            name: input.name,
            email: normalizedEmail,
            phone: input.phone,
            address: input.address,
        })

        if (!updatedUser) {
        throw new InternalServerError(MESSAGES.USER.PROFILE_UPDATE_FAILED);
        }

        return {
            user: UserResponseMapper.toUserProfileDto(updatedUser),
            emailChanged
        }
    }
}