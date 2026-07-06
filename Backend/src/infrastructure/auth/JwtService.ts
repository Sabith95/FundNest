import {injectable} from 'tsyringe'
import jwt from 'jsonwebtoken'
import {env} from '../../config/env'
import { Role } from '../../shared/constants/roles'
import { IJwtService } from './interfaces/IJwtService'

export interface JwtPayload {
    id: string
    email: string
    role: Role
    tenantId?: string
}

@injectable()
export class JwtService  implements IJwtService{

    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(
            payload,
            env.JWT_SECRET,
            {expiresIn: env.JWT_ACCESS_EXPIRES_IN as any}
        )
    }

    generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(
            payload,
            env.JWT_REFRESH_SECRET,
            {expiresIn: env.JWT_REFRESH_EXPIRES_IN as any}
        )
    }

    verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload
    }

    verifyRefreshToken(token: string): JwtPayload {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload
    }

    generateTokenPair(payload: JwtPayload):{
        accessToken: string
        refreshToken: string
    }{
        return{
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        }
    }
}
