import { Request } from "express";

export class TokenExtracter {

    static fromHeader(req: Request): string | null {
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return null
        }

        const token = authHeader.split(' ')[1]
        return token || null
    }
}