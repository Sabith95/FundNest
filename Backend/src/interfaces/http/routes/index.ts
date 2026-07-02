import { Request, Response, Router } from "express";
import { ApiResponse } from "../../../shared/ApiResponse";
import {env} from '../../../config/env'
import authRoutes from './auth/authRoutes'
import userRoutes from '../routes/user/userRoutes'


const router = Router()

router.use('/auth', authRoutes)
router.use('/users',userRoutes)
// Health check

router.get('/health',(_req: Request, res: Response) =>{
    res.status(200).json(
        ApiResponse.success({
            status:'healthy',
            timeStamp: new Date().toISOString(),
            upTime: `${Math.floor(process.uptime())}`,
            enviornment:env.NODE_ENV,
        },
        'FundNest Api is running'
            
        )
    )
})



export default router
