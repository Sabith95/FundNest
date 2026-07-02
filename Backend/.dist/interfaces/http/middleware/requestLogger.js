"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../../../shared/logger");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        const message = `[${req.method} ${req.originalUrl} ${res.statusCode} -${ms}ms]`;
        if (res.statusCode >= 500) {
            logger_1.logger.error(message);
        }
        else if (res.statusCode >= 400) {
            logger_1.logger.warn(message);
        }
        else {
            logger_1.logger.info(message);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
