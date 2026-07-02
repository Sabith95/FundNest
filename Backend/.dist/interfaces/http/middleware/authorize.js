"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.AuthorizeMiddleware = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const constants_1 = require("../../../shared/constants");
class AuthorizeMiddleware {
    constructor(...roles) {
        this.handle = (req, res, next) => {
            if (!req.user) {
                next(new AppError_1.AppError('Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED));
                return;
            }
            if (!this.allowedRoles.includes(req.user?.role)) {
                next(new AppError_1.AppError(`Role ${req.user?.role} is not allowed to access this route`, constants_1.HTTP_STATUS.FORBIDDEN));
                return;
            }
            next();
        };
        this.allowedRoles = roles;
    }
}
exports.AuthorizeMiddleware = AuthorizeMiddleware;
const authorize = (...roles) => {
    const middleware = new AuthorizeMiddleware(...roles);
    return middleware.handle;
};
exports.authorize = authorize;
