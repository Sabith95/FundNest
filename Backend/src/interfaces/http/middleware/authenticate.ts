import { Request, Response, NextFunction } from "express";
import { IJwtService } from "../../../infrastructure/auth/interfaces/IJwtService";
import { AppError } from "../../../shared/errors/AppError";
import { logger } from "../../../shared/logger";
import { IMiddleware } from "./interfaces/IMiddleware";
import { TokenExtracter } from "./helpers/tokenExtracter";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";



export class AuthenticateMiddleware implements IMiddleware {

    constructor(
        private _jwtService: IJwtService
     ){}

     handle = (req: Request, res: Response, next: NextFunction): void =>{
        try {
            // Single Responsibility — extraction delegated to TokenExtractor
            const token = TokenExtracter.fromHeader(req)

            if(!token){
                throw new AppError('No token provided', HTTP_STATUS.UNAUTHORIZED)
            }

            const payload = this._jwtService.verifyAccessToken(token)

            req.user = payload

            logger.debug(`Authenticated ${payload.email}`)
            next()
        } catch (error: any) {
            if(error.name === 'TokenExpiredError'){
                next(new AppError('Token expired', HTTP_STATUS.UNAUTHORIZED))
                return
            }
            
            if(error.name === 'JsonWebTokenError'){
                next(new AppError('Invalid token', HTTP_STATUS.UNAUTHORIZED))
                return
            }
            next(error)
        }
     }
}

// Factory function - creates middleware handler for Express
export const createAuthMiddleware = (
    jwtService: IJwtService
):((req: Request, res: Response, next: NextFunction) => void) =>{
    const middleware = new AuthenticateMiddleware(jwtService)
    return middleware.handle
} 