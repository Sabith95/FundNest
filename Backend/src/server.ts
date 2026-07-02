import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./infrastructure/database/connection";
import { logger } from "./shared/logger";
import createApp from "./app";

const bootStrap = async() =>{
    // connect database
    await connectDatabase()

    //create App

    const app = createApp()

    //start server

    const server = app.listen(env.PORT, ()=>{
        logger.info(`FundNest API running on http://localhost:${env.PORT}`)
        logger.info(`Environment: ${env.NODE_ENV}`)
        logger.info(`Health check: http://localhost:${env.PORT}/api/v1/health`)
    })

    //Graceful shutdown

    const shutDown = async(signal: string) =>{
        logger.warn(`\n${signal} received. Shutting down gracefully...`)

        server.close(async () =>{
            logger.info("HTTP server closed")
            await disconnectDatabase()
            process.exit(0)
        })

        //force exit after 10s if graceful shutdown hangs

        setTimeout(() =>{
            logger.error('forced shutdown after timeout')
            process.exit(1)
        },10_000)
    }

    process.on('SIGTERM',() => shutDown('SIGTERM'))
    process.on('SIGINT',() => shutDown('SIGINT'))

    process.on('unhandledRejection',(reason) =>{
        logger.error('Unhandled promise rejection',reason)
        shutDown('unhandledRejection')
    })

    process.on('uncaughtException',(err) =>{
        logger.error('Uncaught exception:',err)
        shutDown('Uncaught exception')
    })
}

bootStrap()
