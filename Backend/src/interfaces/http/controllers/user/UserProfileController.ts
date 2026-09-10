import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { IGetUserProfileUseCase } from "../../../../application/interface/user/IGetUserProfileUseCase";
import { IUpdateUserProfileUseCase } from "../../../../application/interface/user/IUpdateUserProfileUseCase";
import { IUpdateProfilePhotoUseCase } from "../../../../application/interface/user/IUpdateProfilePhotoUseCase";
import { IChangeUserPasswordUseCase } from "../../../../application/interface/user/IChangeUserPasswordUseCase";
import {
  updateUserProfileSchema,
  changePasswordSchema,
} from "../../validators/userProfileValidator";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";

@injectable()
export class UserProfileController {
  constructor(
    @inject(TOKENS.GetUserProfileUseCase)
    private readonly _getUserProfileUseCase: IGetUserProfileUseCase,

    @inject(TOKENS.UpdateUserProfileUseCase)
    private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,

    @inject(TOKENS.UpdateProfilePhotoUseCase)
    private readonly _updateProfilePhotoUseCase: IUpdateProfilePhotoUseCase,

    @inject(TOKENS.ChangeUserPasswordUseCase)
    private readonly _changeUserPasswordUseCase: IChangeUserPasswordUseCase,
  ) {}

  getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const result = await this._getUserProfileUseCase.execute(req.user.id);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.USER.PROFILE_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const payload = updateUserProfileSchema.parse(req.body);

      const result = await this._updateUserProfileUseCase.execute({
        userId: req.user.id,
        ...payload,
      });

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.USER.PROFILE_UPDATED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  updateProfilePhoto = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      if (!req.file) {
        throw new BadRequestError(MESSAGES.USER.PROFILE_PHOTO_REQUIRED);
      }

      const result = await this._updateProfilePhotoUseCase.execute({
        userId: req.user.id,
        file: {
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
        },
      });

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.USER.PROFILE_PHOTO_UPDATED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError(MESSAGES.USER.NOT_AUTHENTICATED);
      }

      const payload = changePasswordSchema.parse(req.body);

      const result = await this._changeUserPasswordUseCase.execute({
        userId: req.user.id,
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.AUTH.PASSWORD_UPDATED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
