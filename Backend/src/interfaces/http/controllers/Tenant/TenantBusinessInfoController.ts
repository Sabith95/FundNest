import { injectable, inject } from "tsyringe";
import { UpdateBusinessInfoUseCase } from "../../../../application/tenant/use-cases/UpdateBusinessInfoUseCase";
import { updateBusinessInfoSchema } from "../../validators/tenant/tenantBusinessInfoValidatior";
import { MESSAGES } from "../../../../shared/constants/messages";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ApiResponse } from "../../../../shared/ApiResponse";
import { TOKENS } from "../../../../shared/tokens";
import { AppError } from "../../../../shared/errors/AppError";
import { NextFunction, Request, Response } from "express";

@injectable()
export class TenantBusinessInfoController {
    constructor(
        @inject(TOKENS.UpdateBusinessInfoUseCase)
        private readonly _updateBusinessInfoUseCase: UpdateBusinessInfoUseCase
    ) { }

    updateBusinessInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const tenantId = req.tenantId || (req.user as any)?.id;
            if (!tenantId) {
                throw new AppError(MESSAGES.TENANT.NOT_FOUND,HTTP_STATUS.UNAUTHORIZED);
            }
            const payload = updateBusinessInfoSchema.parse(req.body)
            const result = await this._updateBusinessInfoUseCase.execute(tenantId, payload)

            res
                .status(HTTP_STATUS.OK)
                .json(ApiResponse.success(result, MESSAGES.TENANT.BUSINESS_INFO_UPDATED, HTTP_STATUS.OK))
        } catch (error) {
            next(error)
        }

    }
}