import {inject, injectable} from 'tsyringe'
import { TOKENS } from '../../../shared/tokens'
import { IUserRepository } from '../../../domain/repositories/IUserRepository'
import { AppError } from '../../../shared/errors/AppError'
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../shared/constants/messages";
import { toUserProfileDto, UserProfileDto } from '../dto/ProfileDto'

@injectable()
export class GetUserProfileUseCase {
    constructor(
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<UserProfileDto> {
        const user = await this._userRepository.findById(userId)

        if(!user){
            throw new AppError(MESSAGES.USER.NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }

        if(!user.isActive){
            throw new AppError(MESSAGES.AUTH.ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN);
        }

        return toUserProfileDto(user)
    }
}