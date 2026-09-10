import { Request, Response, NextFunction } from "express";
import { Role } from "../../../shared/constants/roles";
import { IMiddleware } from "./interfaces/IMiddleware";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError";

export class AuthorizeMiddleware implements IMiddleware {
  private allowedRoles: Role[];

  constructor(...roles: Role[]) {
    this.allowedRoles = roles;
  }

  handle = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Not authenticated"));
      return;
    }

    if (!this.allowedRoles.includes(req.user?.role as Role)) {
      next(
        new ForbiddenError(
          `Role ${req.user?.role} is not allowed to access this route`,
        ),
      );
      return;
    }
    next();
  };
}

export const authorize = (
  ...roles: Role[]
): ((req: Request, res: Response, next: NextFunction) => void) => {
  const middleware = new AuthorizeMiddleware(...roles);
  return middleware.handle;
};
