import Redis from "ioredis";
import { env } from "../../config/env";
import { logger } from "../../shared/logger";

export const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 3,
})

redisClient.on("error", (err) => {
  logger.error("Redis Connection Error:", err);
});