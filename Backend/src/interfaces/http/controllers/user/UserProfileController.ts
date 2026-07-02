import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { ApiResponse } from "../../../../shared/ApiResponse";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { AppError } from "../../../../shared/errors/AppError";
import { GetUserProfileUseCase } from "../../../../application/user/use-cases/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "../../../../application/user/use-cases/UpdateUserProfileUseCase";
import { UpdateProfilePhotoUseCase } from "../../../../application/user/use-cases/UpdateProfilePhotoUseCase";
import { ChangeUserPasswordUseCase } from "../../../../application/user/use-cases/ChangeUserPasswordUseCase";
import {
  updateUserProfileSchema,
  changePasswordSchema,
} from "../../validators/userProfileValidator";

@injectable()
export class UserProfileController {
    constructor(
        @inject(TOKENS.GetUserProfileUseCase)
        private readonly getUserProfileUseCase: GetUserProfileUseCase,

        @inject(TOKENS.UpdateUserProfileUseCase)
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,

        @inject(TOKENS.UpdateProfilePhotoUseCase)
        private readonly updateProfilePhotoUseCase: UpdateProfilePhotoUseCase,

        @inject(TOKENS.ChangeUserPasswordUseCase)
        private readonly changeUserPasswordUseCase: ChangeUserPasswordUseCase
    ){}

    getProfile = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try {
            if(!req.user?.id){
                throw new AppError(MESSAGES.USER.NOT_AUTHENTICATED, HTTP_STATUS.UNAUTHORIZED)
            }

            const result = await this.getUserProfileUseCase.execute(req.user.id)

            res
                .status(HTTP_STATUS.OK)
                .json(ApiResponse.success(result, MESSAGES.USER.PROFILE_FETCHED))

        } catch (error) {
            next(error)
        }
    }

    updateProfile = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try {
            if(!req.user?.id){
                throw new AppError(MESSAGES.USER.NOT_AUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
            }

            const payload = updateUserProfileSchema.parse(req.body)

            const result = await this.updateUserProfileUseCase.execute({ 

                userId: req.user.id,
                ...payload
            })

            res
                .status(HTTP_STATUS.OK)
                .json(ApiResponse.success(result,MESSAGES.USER.PROFILE_UPDATED))
        } catch (error) {
         next(error)   
        }
    }

    updateProfilePhoto = async(
        req: Request,
        res: Response,
        next: NextFunction
    ):Promise<void> =>{
        try {
            if (!req.user?.id) {
                throw new AppError(MESSAGES.USER.NOT_AUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
            }

            if(!req.file){
                throw new AppError(MESSAGES.USER.PROFILE_PHOTO_REQUIRED,HTTP_STATUS.BAD_REQUEST)
            }

            const result = await this.updateProfilePhotoUseCase.execute({
                userId: req.user.id,
                file:{
                    buffer: req.file.buffer,
                    originalName: req.file.originalname,
                    mimeType: req.file.mimetype,
                },
            })

            res
                .status(HTTP_STATUS.OK)
                .json(ApiResponse.success(result,MESSAGES.USER.PROFILE_PHOTO_UPDATED))
        } catch (error) {
            next(error)
        }
    }

    changePassword = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try {
             if (!req.user?.id) {
                throw new AppError(MESSAGES.USER.NOT_AUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
            }

            const payload = changePasswordSchema.parse(req.body)

            const result = await this.changeUserPasswordUseCase.execute({
                userId: req.user.id,
                currentPassword: payload.currentPassword,
                newPassword: payload.newPassword,
            })
            
            res
                .status(HTTP_STATUS.OK)
                .json(ApiResponse.success(result,MESSAGES.AUTH.PASSWORD_UPDATED))
        } catch (error) {
            next(error)
        }
    }
}