import { Request, Response, NextFunction } from "express";
import {inject, injectable} from 'tsyringe'
import { TOKENS } from "../../../../shared/tokens";
import { ApiResponse } from "../../../../shared/ApiResponse";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { registerTenantSchema,resendTenantOtpSchema,verifyTenantOtpSchema } from "../../validators/tenantAuthValidators";
import { RegisterTenantUseCase } from "../../../../application/auth/use-cases/RegisterTenantUseCase";
import { VerifyTenantOtpUseCase } from "../../../../application/auth/use-cases/VerifyTenantOtpUseCase";
import { ResendTenantOtpUseCase } from "../../../../application/auth/use-cases/ResendTenantOtpUseCase";

@injectable()
export class TenantAuthController {
    constructor(
        @inject(TOKENS.RegisterTenantUseCase)
        private readonly _registerTenantUseCase: RegisterTenantUseCase,
        @inject(TOKENS.VerifyTenantOtpUseCase)
        private readonly _verifyTenantOtpUseCase: VerifyTenantOtpUseCase,
        @inject(TOKENS.ResendTenantOtpUseCase)
        private readonly _resendTenantOtpUseCase: ResendTenantOtpUseCase
    ){}

    registerTenant = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const payload = registerTenantSchema.parse(req.body)
            const result = await this._registerTenantUseCase.execute(payload)

            res
                .status(HTTP_STATUS.CREATED)
                .json(ApiResponse.success(result,MESSAGES.TENANT.CREATED,HTTP_STATUS.CREATED))
        } catch (error) {
            next(error)
        }
    }

    verifyTenantOtp = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const payload = verifyTenantOtpSchema.parse(req.body)
            const result = await this._verifyTenantOtpUseCase.execute(payload)

            res
                .status(HTTP_STATUS.OK)
                .json(ApiResponse.success(result,MESSAGES.AUTH.OTP_VERIFIED))
        } catch (error) {
            next(error)
        }
    }

    resendTenantOtp = async(req: Request, res: Response, next: NextFunction):Promise<void> =>{
        try {
            const payload = resendTenantOtpSchema.parse(req.body)
            const result = await this._resendTenantOtpUseCase.execute(payload)

            res
                .status(HTTP_STATUS.OK)
                .json(ApiResponse.success(result,MESSAGES.AUTH.OTP_VERIFIED))
        } catch (error) {
            next(error)
        }
    }
}