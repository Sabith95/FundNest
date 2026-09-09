import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IGenerateUploadUrlUseCase } from "../../../../application/interface/storage/IGenerateUploadUrlUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { TOKENS } from "../../../../shared/tokens";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { MESSAGES } from "../../../../shared/constants/messages";
import { IGenerateDownloadUrlUseCase } from "../../../../application/interface/storage/IGenerateDownloadUrlUseCase";

@injectable()
export class StorageController {
    constructor(
        @inject(TOKENS.GenerateUploadUrlUseCase)
        private readonly _generateUploadUrlUseCase: IGenerateUploadUrlUseCase,
        @inject(TOKENS.GenerateDownloadUrlUseCase)
        private readonly _generateDownloadUrlUseCase: IGenerateDownloadUrlUseCase
    ) {}

    generateUploadUrl = async (
        req: Request, 
        res: Response,
        next: NextFunction
    ): Promise<void> =>{
        try {
            const tenantId = req.tenantId || (req.user as any)?.id

            if(!tenantId){
                throw new UnauthorizedError(MESSAGES.AUTH.NOT_AUTHENTICATED)
            }

            const {fileName, contentType} = req.body

            if(!fileName || !contentType){
                throw new BadRequestError(MESSAGES.FILE_UPLOAD.FILE_NAME_AND_CONTENT_TYPE_ARE_REQUIRED)
            }

            const result = await this._generateUploadUrlUseCase.execute(
                {fileName, contentType},
                tenantId
            )

            ResponseHandler.success(
                res,
                HTTP_STATUS.OK,
                MESSAGES.STORAGE.UPLOAD_URL_GENERATED,
                result
            )
        } catch (error) {
            next(error)
        }
    }

    generateDownloadUrl = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { objectKey } = req.body;
            if (!objectKey) {
                throw new BadRequestError("objectKey is required");
            }
            const result = await this._generateDownloadUrlUseCase.execute(objectKey);
            ResponseHandler.success(
                res,
                HTTP_STATUS.OK,
                "Download URL generated successfully",
                result
            );
        } catch (error) {
            next(error);
        }
    };
}