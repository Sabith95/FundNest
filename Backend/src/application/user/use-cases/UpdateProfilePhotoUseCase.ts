import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IImageStorageService } from "../../../infrastructure/storage/interfaces/IImageStorageService";
import { MESSAGES } from "../../../shared/constants/messages";
import {
  UpdateProfilePhotoDto,
  UserProfileDto,
  toUserProfileDto,
} from "../dto/ProfileDto";
import { IUpdateProfilePhotoUseCase } from "../../interface/user/IUpdateProfilePhotoUseCase";
import { NotFoundError } from "../../../shared/errors/NotFoundError";
import { InternalServerError } from "../../../shared/errors/InternalServerError";

@injectable()
export class UpdateProfilePhotoUseCase implements IUpdateProfilePhotoUseCase {
    constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ImageStorageService)
    private readonly _imageStorageService: IImageStorageService
  ) {}

  async execute(input: UpdateProfilePhotoDto): Promise<UserProfileDto> {
    const user = await this._userRepository.findById(input.userId);

    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }

     const uploadedImage = await this._imageStorageService.uploadImage({
      buffer: input.file.buffer,
      filename: `${user.id}-${Date.now()}-${input.file.originalName}`,
    });

     const updatedUser = await this._userRepository.updateProfilePhoto(
      user.id,
      uploadedImage.url,
      uploadedImage.publicId
    );

    if(!updatedUser){
        await this._imageStorageService.deleteImage(uploadedImage.publicId)
        throw new InternalServerError(
            MESSAGES.USER.PROFILE_PHOTO_UPDATE_FAILED
        )
    }

    if (user.profile?.avatarPublicId) {
      this._imageStorageService
        .deleteImage(user.profile.avatarPublicId)
        .catch(() => undefined);
    }

    return toUserProfileDto(updatedUser);
  }
}