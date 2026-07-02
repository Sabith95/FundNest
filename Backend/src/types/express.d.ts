import { JwtPayload } from "../infrastructure/auth/JwtService";

declare global {
    namespace Express {
        interface Request{
            user?: JwtPayload
            tenantId?: string
        }
    }
}