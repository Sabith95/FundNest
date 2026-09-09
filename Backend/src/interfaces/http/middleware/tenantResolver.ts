import {Request, Response, NextFunction} from 'express'
import { ROLES } from '../../../shared/constants/roles'
import { BadRequestError } from '../../../shared/errors/BadRequestError'

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
        next(new BadRequestError('Tenant ID is required'))
        return
    }

    req.tenantId = tenantId
    next()
}