"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthMiddleware = exports.AuthenticateMiddleware = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const logger_1 = require("../../../shared/logger");
const tokenExtracter_1 = require("./helpers/tokenExtracter");
const constants_1 = require("../../../shared/constants");
class AuthenticateMiddleware {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.handle = (req, res, next) => {
            try {
                // Single Responsibility — extraction delegated to TokenExtractor
                const token = tokenExtracter_1.TokenExtracter.fromHeader(req);
                if (!token) {
                    throw new AppError_1.AppError('No token provided', constants_1.HTTP_STATUS.UNAUTHORIZED);
                }
                const payload = this.jwtService.verifyAccessToken(token);
                req.user = payload;
                logger_1.logger.debug(`Authenticated ${payload.email}`);
                next();
            }
            catch (error) {
                if (error.name === 'TokenExpiredErro') {
                    next(new AppError_1.AppError('Token expired', constants_1.HTTP_STATUS.UNAUTHORIZED));
                    return;
                }
                if (error.name === 'JsonWebTokenError') {
                    next(new AppError_1.AppError('Invalid token', constants_1.HTTP_STATUS.UNAUTHORIZED));
                    return;
                }
                next(error);
            }
        };
    }
}
exports.AuthenticateMiddleware = AuthenticateMiddleware;
// Factory function - creates middleware handler for Express
const createAuthMiddleware = (jwtService) => {
    const middleware = new AuthenticateMiddleware(jwtService);
    return middleware.handle;
};
exports.createAuthMiddleware = createAuthMiddleware;
