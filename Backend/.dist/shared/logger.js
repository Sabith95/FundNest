"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const env_1 = require("../config/env");
const { combine, timestamp, colorize, printf, json, errors } = winston_1.format;
const devFormat = printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
});
exports.logger = (0, winston_1.createLogger)({
    level: env_1.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), env_1.env.NODE_ENV === 'production' ? json() : combine(colorize(), devFormat)),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/combined.log' }),
    ],
});
