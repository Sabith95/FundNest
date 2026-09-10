import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/tokens";
import { ILoginSuperAdminUseCase } from "../../../../application/interface/auth/ILoginSuperAdminUseCase";
import { ResponseHandler } from "../../../../shared/ResponseHandler";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { MESSAGES } from "../../../../shared/constants/messages";
import {
  loginSchema,
  registerUserSchema,
  googleLoginSchema,
  verifyOtpSchema,
} from "../../validators/authValidator";
import { IRegisterUserUseCase } from "../../../../application/interface/auth/IRegisterUseCase";
import { IGoogleUserLoginUseCase } from "../../../../application/interface/auth/IGoogleUserLoginUseCase";
import { IVerifyUserOtpUseCase } from "../../../../application/interface/auth/IVerifyUserOtpUseCase";
import { IResendUserOtpUseCase } from "../../../../application/interface/auth/IResendUserOtpUseCase";
import {
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../validators/authValidator";
import { IRequestPasswordResetOtpUseCase } from "../../../../application/interface/auth/IRequestPasswordResetOtpUseCase";
import { IVerifyPasswordResetOtpUseCase } from "../../../../application/interface/auth/IVerifyPasswordResetOtpUseCase";
import { IResetUserPasswordUseCase } from "../../../../application/interface/auth/IResetUserPasswordUseCase";
import { ILoginUserUseCase } from "../../../../application/interface/auth/ILoginUserUseCase";
import { IRefreshTokenUseCase } from "../../../../application/interface/auth/IRefreshTokenUseCase";
import {
  LEGACY_REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAMES,
  refreshTokenCookieOptions,
} from "../../../../shared/cookies";

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.LoginSuperAdminUseCase)
    private readonly _loginSuperAdminUseCase: ILoginSuperAdminUseCase,
    @inject(TOKENS.RegisterUserUseCase)
    private readonly _registerUserUserCase: IRegisterUserUseCase,
    @inject(TOKENS.GoogleUserLoginUseCase)
    private readonly _googleUserLoginUseCase: IGoogleUserLoginUseCase,
    @inject(TOKENS.VerifyUserOtpUseCase)
    private readonly _verifyUserOtpUseCase: IVerifyUserOtpUseCase,
    @inject(TOKENS.ResendUserOtpUseCase)
    private readonly _resendUserOtpUseCase: IResendUserOtpUseCase,
    @inject(TOKENS.RequestPasswordResetOtpUseCase)
    private readonly _requestPasswordResetOtpUseCase: IRequestPasswordResetOtpUseCase,
    @inject(TOKENS.VerifyPasswordResetOtpUseCase)
    private readonly _verifyPasswordResetOtpUseCase: IVerifyPasswordResetOtpUseCase,
    @inject(TOKENS.ResetUserPasswordUseCase)
    private readonly _resetUserPasswordUseCase: IResetUserPasswordUseCase,
    @inject(TOKENS.LoginUserUseCase)
    private readonly _loginUserUseCase: ILoginUserUseCase,
    @inject(TOKENS.RefreshTokenUseCase)
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
  ) {}

  loginSuperAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await this._loginSuperAdminUseCase.execute(payload);

      res.cookie(
        REFRESH_TOKEN_COOKIE_NAMES.SUPER_ADMIN,
        result.tokens.refreshToken,
        refreshTokenCookieOptions,
      );
      res.clearCookie(
        LEGACY_REFRESH_TOKEN_COOKIE_NAME,
        refreshTokenCookieOptions,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.SUPER_ADMIN.LOGGED_IN,
        {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
      );
    } catch (error) {
      next(error);
    }
  };

  registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = registerUserSchema.parse(req.body);
      const result = await this._registerUserUserCase.execute(payload);

      ResponseHandler.success(
        res,
        HTTP_STATUS.CREATED,
        MESSAGES.USER.CREATED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  googleUserLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = googleLoginSchema.parse(req.body);
      const result = await this._googleUserLoginUseCase.execute(payload);

      res.cookie(
        REFRESH_TOKEN_COOKIE_NAMES.USER,
        result.tokens.refreshToken,
        refreshTokenCookieOptions,
      );
      res.clearCookie(
        LEGACY_REFRESH_TOKEN_COOKIE_NAME,
        refreshTokenCookieOptions,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESSFULL,
        {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
      );
    } catch (error) {
      next(error);
    }
  };

  verifyUserOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = verifyOtpSchema.parse(req.body);
      const result = await this._verifyUserOtpUseCase.execute(payload);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.AUTH.OTP_VERIFIED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  resendUserOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = resendOtpSchema.parse(req.body);
      const result = await this._resendUserOtpUseCase.execute(payload);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.AUTH.OTP_RESENT,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  requestPasswordResetOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = forgotPasswordSchema.parse(req.body);
      const result =
        await this._requestPasswordResetOtpUseCase.execute(payload);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.AUTH.PASSWORD_RESET_OTP_SENT,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  verifyPasswordResetOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = verifyOtpSchema.parse(req.body);
      const result = await this._verifyPasswordResetOtpUseCase.execute(payload);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.AUTH.PASSWORD_RESET_OTP_VERIFIED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  resetUserPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = resetPasswordSchema.parse(req.body);
      const result = await this._resetUserPasswordUseCase.execute(payload);

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

  loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await this._loginUserUseCase.execute(payload);

      res.cookie(
        REFRESH_TOKEN_COOKIE_NAMES.USER,
        result.tokens.refreshToken,
        refreshTokenCookieOptions,
      );
      res.clearCookie(
        LEGACY_REFRESH_TOKEN_COOKIE_NAME,
        refreshTokenCookieOptions,
      );

      ResponseHandler.success(res, HTTP_STATUS.OK, MESSAGES.USER.LOGGED_IN, {
        user: result.user,
        accessToken: result.tokens.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  private handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
    cookieName: string,
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies?.[cookieName];

      const result = await this._refreshTokenUseCase.execute(refreshToken);

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.AUTH.REFRESH_TOKEN_CREATED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };

  refreshUserToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await this.handleRefreshToken(
      req,
      res,
      next,
      REFRESH_TOKEN_COOKIE_NAMES.USER,
    );
  };

  refreshSuperAdminToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await this.handleRefreshToken(
      req,
      res,
      next,
      REFRESH_TOKEN_COOKIE_NAMES.SUPER_ADMIN,
    );
  };

  refreshTenantToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await this.handleRefreshToken(
      req,
      res,
      next,
      REFRESH_TOKEN_COOKIE_NAMES.TENANT,
    );
  };

  private handleLogout = async (
    res: Response,
    next: NextFunction,
    cookieName: string,
  ): Promise<void> => {
    try {
      res.clearCookie(cookieName, refreshTokenCookieOptions);
      res.clearCookie(
        LEGACY_REFRESH_TOKEN_COOKIE_NAME,
        refreshTokenCookieOptions,
      );

      ResponseHandler.success(
        res,
        HTTP_STATUS.OK,
        MESSAGES.COMMON.LOGGED_OUT,
        null,
      );
    } catch (error) {
      next(error);
    }
  };

  logoutUser = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await this.handleLogout(res, next, REFRESH_TOKEN_COOKIE_NAMES.USER);
  };

  logoutSuperAdmin = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await this.handleLogout(res, next, REFRESH_TOKEN_COOKIE_NAMES.SUPER_ADMIN);
  };

  logoutTenant = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await this.handleLogout(res, next, REFRESH_TOKEN_COOKIE_NAMES.TENANT);
  };
}
