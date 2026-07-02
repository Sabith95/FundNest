import {CorsOptions} from 'cors'
import {env} from './env'

export const corsOptions : CorsOptions ={
    origin: (origin, callback) =>{
        const allowed = env.CORS_ORIGIN.split(',').map((o) => o.trim() )
        if(!origin || allowed.includes(origin)){
            callback(null,true)
        }else{
            callback(new Error(`CORS Origin ${origin} not allowed`))
        }
    },
    credentials:true,
    methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization','X-Tenant-ID'],
    exposedHeaders:['X-Total-Count'],
    maxAge:86400,
}