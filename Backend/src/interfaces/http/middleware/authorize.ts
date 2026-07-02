import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";
import {  Role } from "../../../shared/constants";
import { HTTP_STATUS } from "../../../shared/constants";
import { IMiddleware } from "./interfaces/IMiddleware";


export class AuthorizeMiddleware implements IMiddleware {
    
    private allowedRoles : Role[]

    constructor(...roles: Role[]){
        this.allowedRoles = roles
    }

    handle = (req: Request, res: Response, next: NextFunction): void =>{
        if(!req.user){
            next(new AppError('Not authenticated', HTTP_STATUS.UNAUTHORIZED))
            return
        }

        if(!this.allowedRoles.includes(req.user?.role as Role)) {
            next(new AppError(`Role ${req.user?.role} is not allowed to access this route`, HTTP_STATUS.FORBIDDEN))
            return
        }
        next()
    }
}

export const authorize = (
    ...roles: Role[]
):((req: Request, res: Response, next: NextFunction) => void) =>{
    const middleware = new AuthorizeMiddleware(...roles)
    return middleware.handle
}