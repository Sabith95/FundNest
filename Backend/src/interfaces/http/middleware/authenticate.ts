import { Request, Response, NextFunction } from "express";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { logger } from "../../../shared/logger";
import { IMiddleware } from "./interfaces/IMiddleware";
import { TokenExtracter } from "./helpers/tokenExtracter";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";

export class AuthenticateMiddleware implements IMiddleware {
  constructor(private _jwtService: IJwtService) {}

  handle = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = TokenExtracter.fromHeader(req);

      if (!token) {
        throw new UnauthorizedError("No token provided");
      }

      const payload = this._jwtService.verifyAccessToken(token);

      req.user = payload;

      logger.debug(`Authenticated ${payload.email}`);
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        next(new UnauthorizedError("Token expired"));
        return;
      }

      if (error.name === "JsonWebTokenError") {
        next(new UnauthorizedError("Invalid token"));
        return;
      }
      next(error);
    }
  };
}

// Factory function - creates middleware handler for Express
export const createAuthMiddleware = (
  jwtService: IJwtService,
): ((req: Request, res: Response, next: NextFunction) => void) => {
  const middleware = new AuthenticateMiddleware(jwtService);
  return middleware.handle;
};
