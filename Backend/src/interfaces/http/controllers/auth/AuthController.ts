import { Request, Response, NextFunction } from "express";
import {inject, injectable} from 'tsyringe'
import { TOKENS } from "../../../../shared/tokens";
import { LoginSuperAdminUseCase } from "../../../../application/auth/use-cases/LoginSuperAdminUseCase";
import { ApiResponse } from "../../../../shared/ApiResponse";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import { loginSchema, registerUserSchema, googleLoginSchema, verifyOtpSchema } from "../../validators/authValidator";
import { RegisterUserUseCase } from "../../../../application/auth/use-cases/RegisterUserUseCase";
import { GoogleUserLoginUseCase } from "../../../../application/auth/use-cases/GoogleUserLoginUseCase";
import { VerifyUserOtpUseCase } from "../../../../application/auth/use-cases/VerifyUserOtpUseCase";
import { ResendUserOtpUseCase } from "../../../../application/auth/use-cases/ResendUserOtpUseCase";
import { resendOtpSchema, forgotPasswordSchema,resetPasswordSchema } from "../../validators/authValidator";
import { RequestPasswordResetOtpUseCase } from "../../../../application/auth/use-cases/RequestPasswordResetOtpUseCase";
import { VerifyPasswordResetOtpUseCase } from "../../../../application/auth/use-cases/VerifyPasswordResetOtpUseCase";
import { ResetUserPasswordUseCase } from "../../../../application/auth/use-cases/ResetUserPasswordUseCase";
import { LoginUserUseCase } from "../../../../application/auth/use-cases/LoginUserUseCase";
import { RefreshTokenUseCase } from "../../../../application/auth/use-cases/RefreshTokenUseCase";
import { LEGACY_REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAMES, refreshTokenCookieOptions } from "../../../../shared/cookies";

@injectable()
export class AuthController {
  constructor(

    @inject(TOKENS.LoginSuperAdminUseCase)
    private readonly _loginSuperAdminUseCase: LoginSuperAdminUseCase,
    @inject(TOKENS.RegisterUserUseCase)
    private readonly _registerUserUserCase: RegisterUserUseCase,
    @inject(TOKENS.GoogleUserLoginUseCase)
    private readonly _googleUserLoginUseCase: GoogleUserLoginUseCase,
    @inject(TOKENS.VerifyUserOtpUseCase)
    private readonly _verifyUserOtpUseCase: VerifyUserOtpUseCase,
    @inject(TOKENS.ResendUserOtpUseCase)
    private readonly _resendUserOtpUseCase: ResendUserOtpUseCase,
    @inject(TOKENS.RequestPasswordResetOtpUseCase)
    private readonly _requestPasswordResetOtpUseCase: RequestPasswordResetOtpUseCase,
    @inject(TOKENS.VerifyPasswordResetOtpUseCase)
    private readonly _verifyPasswordResetOtpUseCase: VerifyPasswordResetOtpUseCase,
    @inject(TOKENS.ResetUserPasswordUseCase)
    private readonly _resetUserPasswordUseCase: ResetUserPasswordUseCase,
    @inject(TOKENS.LoginUserUseCase)
    private readonly _loginUserUseCase: LoginUserUseCase,
    @inject(TOKENS.RefreshTokenUseCase)
    private readonly _refreshTokenUseCase: RefreshTokenUseCase,
  ){}

  loginSuperAdmin = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> =>{

    try {
      const payload = loginSchema.parse(req.body)
      const result = await this._loginSuperAdminUseCase.execute(payload)

      // res.status(HTTP_STATUS.OK)
      // .json(ApiResponse.success(result, 'Super admin logged in successfully'))

      res.cookie(
        REFRESH_TOKEN_COOKIE_NAMES.SUPER_ADMIN,
        result.tokens.refreshToken,
        refreshTokenCookieOptions
      )
      res.clearCookie(LEGACY_REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions)

      res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(
          {
            user: result.user,
            accessToken: result.tokens.accessToken,
          },
          MESSAGES.SUPER_ADMIN.LOGGED_IN
        ))
    } catch (error) {
      next(error)
    }
  }

  registerUser = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
      const payload = registerUserSchema.parse(req.body)
      const result = await this._registerUserUserCase.execute(payload)

      res
        .status(HTTP_STATUS.CREATED)
        .json(ApiResponse.success(result, MESSAGES.USER.CREATED, HTTP_STATUS.CREATED))
    } catch (error) {
      next(error)
    }
  }

  googleUserLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
      const payload = googleLoginSchema.parse(req.body)
      const result = await this._googleUserLoginUseCase.execute(payload)

      res.cookie(
        REFRESH_TOKEN_COOKIE_NAMES.USER,
        result.tokens.refreshToken,
        refreshTokenCookieOptions
      )
      res.clearCookie(LEGACY_REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions)

      res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(
          {
            user: result.user,
            accessToken: result.tokens.accessToken,
          },
          MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESSFULL
        ))
    } catch (error) {
        next(error)      
    }
  }

  verifyUserOtp = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
      const payload = verifyOtpSchema.parse(req.body)
      const result = await this._verifyUserOtpUseCase.execute(payload)

      res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result, MESSAGES.AUTH.OTP_VERIFIED))
    } catch (error) {
      next(error)
    }
  }

  resendUserOtp = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
      const payload = resendOtpSchema.parse(req.body)
      const result = await this._resendUserOtpUseCase.execute(payload)

      res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result,MESSAGES.AUTH.OTP_RESENT))
    } catch (error) {
      next(error)
    }
  }

  requestPasswordResetOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = forgotPasswordSchema.parse(req.body);
    const result = await this._requestPasswordResetOtpUseCase.execute(payload);

    res.status(HTTP_STATUS.OK).json(
      ApiResponse.success(result, MESSAGES.AUTH.PASSWORD_RESET_OTP_SENT)
    );
  } catch (error) {
    next(error);
  }
};

  verifyPasswordResetOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = verifyOtpSchema.parse(req.body);
      const result = await this._verifyPasswordResetOtpUseCase.execute(payload);

      res.status(HTTP_STATUS.OK).json(
        ApiResponse.success(result, MESSAGES.AUTH.PASSWORD_RESET_OTP_VERIFIED)
      );
    } catch (error) {
      next(error);
    }
  };

resetUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = resetPasswordSchema.parse(req.body);
    const result = await this._resetUserPasswordUseCase.execute(payload);

    res.status(HTTP_STATUS.OK).json(
      ApiResponse.success(result, MESSAGES.AUTH.PASSWORD_UPDATED)
    );
  } catch (error) {
    next(error);
  }
};

loginUser = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
  try {
    const payload = loginSchema.parse(req.body)
    const result = await this._loginUserUseCase.execute(payload)

    // res
    //   .status(HTTP_STATUS.OK)
    //   .json(ApiResponse.success(result,'User logged in successfully'))

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAMES.USER,
      result.tokens.refreshToken,
      refreshTokenCookieOptions
    )
    res.clearCookie(LEGACY_REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions)

    res
      .status(HTTP_STATUS.OK )
      .json(
        ApiResponse.success({
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
        MESSAGES.USER.LOGGED_IN
      )
      )
  } catch (error) {
    next(error)
  }
}



private handleRefreshToken = async(
  req: Request,
  res: Response,
  next: NextFunction,
  cookieName: string
): Promise<void> =>{
  try {
    const refreshToken = req.cookies?.[cookieName]

    const result = await this._refreshTokenUseCase.execute(refreshToken)

    res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(result, MESSAGES.AUTH.REFRESH_TOKEN_CREATED))
  } catch (error) {
    next(error)
  }
}

refreshUserToken = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  await this.handleRefreshToken(req, res, next, REFRESH_TOKEN_COOKIE_NAMES.USER)
}

refreshSuperAdminToken = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  await this.handleRefreshToken(req, res, next, REFRESH_TOKEN_COOKIE_NAMES.SUPER_ADMIN)
}

private handleLogout = async(res: Response, next: NextFunction, cookieName: string): Promise<void> => {
  try {
    res.clearCookie(cookieName, refreshTokenCookieOptions)
    res.clearCookie(LEGACY_REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions)

    res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(null, MESSAGES.COMMON.LOGGED_OUT))
  } catch (error) {
    next(error)
  }
}

logoutUser = async(_req: Request, res: Response, next: NextFunction): Promise<void> => {
  await this.handleLogout(res, next, REFRESH_TOKEN_COOKIE_NAMES.USER)
}

logoutSuperAdmin = async(_req: Request, res: Response, next: NextFunction): Promise<void> => {
  await this.handleLogout(res, next, REFRESH_TOKEN_COOKIE_NAMES.SUPER_ADMIN)
}

}
