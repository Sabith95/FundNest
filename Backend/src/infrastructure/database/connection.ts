import mongoose from 'mongoose'
import {env} from '../../config/env'
import {logger} from '../../shared/logger'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 3000

const connectWithRetry = async (attempt = 1): Promise<void> =>{
    try {
        await mongoose.connect(env.MONGO_URI,{
            maxPoolSize:10,
            serverSelectionTimeoutMS:5000,
            socketTimeoutMS:45000,
        })
        logger.info(`mongo db connected ${mongoose.connection.host}`)

        mongoose.connection.on('disconnected',() =>{
            logger.warn('mongo db disconnected. Reconnecting...')
        })

        mongoose.connection.on('error', (err) => {
        logger.error('MongoDB error', err.message);
        });

    } catch (error:any) {
        logger.error(`mongo db attempt ${attempt} failed: ${error.message}`)

        if(attempt < MAX_RETRIES){
            logger.warn('Retrying...')
            await new Promise((res) => setTimeout(res,RETRY_DELAY_MS))
            return connectWithRetry(attempt + 1)
        }

        logger.error('max retries reached. Shutting down')
        process.exit(1)
    }
}

export const connectDatabase = connectWithRetry

export const disconnectDatabase = async (): Promise<void> =>{
    await mongoose.connection.close()
    logger.info('mongo db disconnected cleanly')
}