import { UpdateProfilePhotoDto } from "../../user/dto/ProfileDto";
import { UserProfileDto } from "../../user/dto/ProfileDto";

export interface IUpdateProfilePhotoUseCase {
    execute(input: UpdateProfilePhotoDto): Promise<UserProfileDto>
}