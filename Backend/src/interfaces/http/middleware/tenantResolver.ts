import {Request, Response, NextFunction} from 'express'
import { AppError } from '../../../shared/errors/AppError'
import { HTTP_STATUS } from '../../../shared/constants'
import { ROLES } from '../../../shared/constants'

export const tenantResolver = (req: Request, res: Response, next:NextFunction): void =>{
    if(req.user?.role === ROLES.SUPER_ADMIN){
        next()
        return
    }

    let tenantId = req.user?.tenantId

    if(!tenantId){
        tenantId= req.headers['x-tenant-id'] as string
    }

    if(!tenantId){
        next(new AppError('Tenant ID is required', HTTP_STATUS.BAD_REQUEST))
        return
    }

    req.tenantId = tenantId
    next()
}