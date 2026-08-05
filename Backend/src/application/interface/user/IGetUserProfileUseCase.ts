import { UserProfileDto } from "../../user/dto/ProfileDto";

export interface IGetUserProfileUseCase {
    execute(userId: string): Promise<UserProfileDto>
}