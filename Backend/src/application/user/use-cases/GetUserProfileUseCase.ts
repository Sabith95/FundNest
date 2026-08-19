import {inject, injectable} from 'tsyringe'
import { TOKENS } from '../../../shared/tokens'
import { IUserRepository } from '../../../domain/repositories/IUserRepository'
import { MESSAGES } from "../../../shared/constants/messages";
import {  UserProfileDto } from '../dto/ProfileDto'
import { IGetUserProfileUseCase } from '../../interface/user/IGetUserProfileUseCase';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';
import { UserResponseMapper } from '../../mapper/UserResponseMapper';

@injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
    constructor(
        @inject(TOKENS.UserRepository)
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<UserProfileDto> {
        const user = await this._userRepository.findById(userId)

        if(!user){
            throw new NotFoundError(MESSAGES.USER.NOT_FOUND)
        }

        if(!user.isActive){
            throw new ForbiddenError(MESSAGES.AUTH.ACCOUNT_INACTIVE);
        }

        return UserResponseMapper.toUserProfileDto(user)
    }
}