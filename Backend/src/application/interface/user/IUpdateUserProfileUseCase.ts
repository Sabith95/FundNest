import { UpdateProfileDto } from "../../user/dto/ProfileDto";
import { UpdateProfileResponseDto } from "../../user/dto/ProfileDto";

export interface IUpdateUserProfileUseCase {
  execute(input: UpdateProfileDto): Promise<UpdateProfileResponseDto>;
}
