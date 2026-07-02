"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../../config/env");
const logger_1 = require("../../shared/logger");
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;
const connectWithRetry = async (attempt = 1) => {
    try {
        await mongoose_1.default.connect(env_1.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger_1.logger.info(`mongo db connected ${mongoose_1.default.connection.host}`);
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('mongo db disconnected. Reconnecting...');
        });
        mongoose_1.default.connection.on('error', (err) => {
            logger_1.logger.error('MongoDB error', err.message);
        });
    }
    catch (error) {
        logger_1.logger.error(`mongo db attempt ${attempt} failed: ${error.message}`);
        if (attempt < MAX_RETRIES) {
            logger_1.logger.warn('Retrying...');
            await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
            return connectWithRetry(attempt + 1);
        }
        logger_1.logger.error('max retries reached. Shutting down');
        process.exit(1);
    }
};
exports.connectDatabase = connectWithRetry;
const disconnectDatabase = async () => {
    await mongoose_1.default.connection.close();
    logger_1.logger.info('mongo db disconnected cleanly');
};
exports.disconnectDatabase = disconnectDatabase;
