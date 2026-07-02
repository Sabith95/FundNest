"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const connection_1 = require("./infrastructure/database/connection");
const logger_1 = require("./shared/logger");
const app_1 = __importDefault(require("./app"));
const bootStrap = async () => {
    // connect database
    await (0, connection_1.connectDatabase)();
    //create App
    const app = (0, app_1.default)();
    //start server
    const server = app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`FundNest API running on http://localhost:${env_1.env.PORT}`);
        logger_1.logger.info(`Environment: ${env_1.env.NODE_ENV}`);
        logger_1.logger.info(`Health check: http://localhost:${env_1.env.PORT}/api/v1/health`);
    });
    //Graceful shutdown
    const shutDown = async (signal) => {
        logger_1.logger.warn(`\n${signal} received. Shutting down gracefully...`);
        server.close(async () => {
            logger_1.logger.info("HTTP server closed");
            await (0, connection_1.disconnectDatabase)();
            process.exit(0);
        });
        //force exit after 10s if graceful shutdown hangs
        setTimeout(() => {
            logger_1.logger.error('forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', () => shutDown('SIGTERM'));
    process.on('SIGINT', () => shutDown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
        logger_1.logger.error('Unhandled promise rejection', reason);
        shutDown('unhandledRejection');
    });
    process.on('uncaughtException', (err) => {
        logger_1.logger.error('Uncaught exception:', err);
        shutDown('Uncaught exception');
    });
};
bootStrap();
