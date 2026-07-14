import { injectable, inject } from "tsyringe";
import { MESSAGES } from "../../../../shared/constants/messages";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ApiResponse } from "../../../../shared/ApiResponse";
import { TOKENS } from "../../../../shared/tokens";
import { AppError } from "../../../../shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { updateBankDetailsSchema } from "../../validators/tenant/updateBankDetailsSchema";
import { UpdateBankDetailsUseCase } from "../../../../application/tenant/use-cases/UpdateBankDetailsUseCase";


@injectable()
export class TenantBankDetailsController {
    constructor (
        @inject(TOKENS.UpdateBankDetailsUseCase)
        private readonly _updateBankDetailsUseCase: UpdateBankDetailsUseCase
    ){ }

    updateBankingDetails = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const tenantId = req.tenantId || (req.user as any)?.id;
            if (!tenantId) {
                throw new AppError(MESSAGES.TENANT.NOT_FOUND,HTTP_STATUS.UNAUTHORIZED);
            }

            const payload = updateBankDetailsSchema.parse(req.body)
            const result = await this._updateBankDetailsUseCase.execute(tenantId,payload)

            res 
                .status(HTTP_STATUS.OK)
                .json(ApiResponse.success(result,MESSAGES.TENANT.BANKING_DETAILS_UPDATED))
        } catch (error) {
            next(error)
        }
    }
}