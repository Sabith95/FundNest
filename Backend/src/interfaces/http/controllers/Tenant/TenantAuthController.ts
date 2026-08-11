import { Request, Response, NextFunction } from "express";
import { inject, injectable } from 'tsyringe'
import { TOKENS } from "../../../../shared/tokens";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { registerTenantSchema, resendTenantOtpSchema, verifyTenantOtpSchema } from "../../validators/tenant/tenantAuthValidators";
import { IRegisterTenantUseCase } from "../../../../application/interface/tenant/IRegisterTenantUseCase";
import { IVerifyTenantOtpUseCase } from "../../../../application/interface/tenant/IVerifyTenantOtpUseCase";
import { IResendTenantOtpUseCase } from "../../../../application/interface/tenant/IResendTenantOtpUseCase";
import { REFRESH_TOKEN_COOKIE_NAMES, refreshTokenCookieOptions } from "../../../../shared/cookies";
import { ILoginTenantUseCase } from "../../../../application/interface/auth/ILoginTenantUseCase";
import { loginSchema } from "../../validators/authValidator";

@injectable()
export class TenantAuthController {
    constructor(
        @inject(TOKENS.RegisterTenantUseCase)
        private readonly _registerTenantUseCase: IRegisterTenantUseCase,
        @inject(TOKENS.VerifyTenantOtpUseCase)
        private readonly _verifyTenantOtpUseCase: IVerifyTenantOtpUseCase,
        @inject(TOKENS.ResendTenantOtpUseCase)
        private readonly _resendTenantOtpUseCase: IResendTenantOtpUseCase,
        @inject(TOKENS.LoginTenantUseCase)
        private readonly _loginTenantUseCase: ILoginTenantUseCase
    ) { }

    loginTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const payload = loginSchema.parse(req.body)
            const result = await this._loginTenantUseCase.execute(payload)

            res.cookie(REFRESH_TOKEN_COOKIE_NAMES.TENANT, result.tokens.refreshToken, refreshTokenCookieOptions)
            ResponseHandler.success(res, HTTP_STATUS.OK, MESSAGES.AUTH.LOGIN_SUCCESS, {
                tenant: result.tenant,
                accessToken: result.tokens.accessToken,
            })
        } catch (error) {
            next(error)
        }
    }
    registerTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const payload = registerTenantSchema.parse(req.body)
            const result = await this._registerTenantUseCase.execute(payload)

            // res
            //     .status(HTTP_STATUS.CREATED)
            //     .json(ApiResponse.success(result, MESSAGES.TENANT.CREATED, HTTP_STATUS.CREATED))

            ResponseHandler.success(
                res,
                HTTP_STATUS.OK,
                MESSAGES.TENANT.CREATED,
                result
            )

        } catch (error) {
            next(error)
        }
    }

    verifyTenantOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const payload = verifyTenantOtpSchema.parse(req.body)
            const result = await this._verifyTenantOtpUseCase.execute(payload)

            res.cookie(
                REFRESH_TOKEN_COOKIE_NAMES.TENANT,
                result.refreshToken,
                refreshTokenCookieOptions
            )

            // res
            //     .status(HTTP_STATUS.OK)
            //     .json(ApiResponse.success({
            //         email: result.email,
            //         isEmailVerified: result.isEmailVerified,
            //         accessToken: result.accessToken,
            //     }, MESSAGES.AUTH.OTP_VERIFIED))

            ResponseHandler.success(
                res,
                HTTP_STATUS.OK,
                MESSAGES.AUTH.OTP_VERIFIED,
                {
                    email: result.email,
                    isEmailVerified: result.isEmailVerified,
                    accessToken: result.accessToken
                }
            )
        } catch (error) {
            next(error)
        }
    }

    resendTenantOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const payload = resendTenantOtpSchema.parse(req.body)
            const result = await this._resendTenantOtpUseCase.execute(payload)

            ResponseHandler.success(
                res,
                HTTP_STATUS.OK,
                MESSAGES.AUTH.OTP_VERIFIED,
                result
            )
        } catch (error) {
            next(error)
        }
    }
}
