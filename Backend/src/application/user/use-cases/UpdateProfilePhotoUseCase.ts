import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../shared/tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IImageStorageService } from "../../../infrastructure/storage/interfaces/IImageStorageService";
import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../shared/constants/messages";
import {
  UpdateProfilePhotoDto,
  UserProfileDto,
  toUserProfileDto,
} from "../dto/ProfileDto";

@injectable()
export class UpdateProfilePhotoUseCase {
    constructor(
    @inject(TOKENS.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TOKENS.ImageStorageService)
    private readonly _imageStorageService: IImageStorageService
  ) {}

  async execute(input: UpdateProfilePhotoDto): Promise<UserProfileDto> {
    const user = await this._userRepository.findById(input.userId);

    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
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
        throw new AppError(
            MESSAGES.USER.PROFILE_PHOTO_UPDATE_FAILED,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
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