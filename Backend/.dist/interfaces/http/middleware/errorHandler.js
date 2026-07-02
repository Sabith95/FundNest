"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const ApiResponse_1 = require("../../../shared/ApiResponse");
const AppError_1 = require("../../../shared/errors/AppError");
const logger_1 = require("../../../shared/logger");
const env_1 = require("../../../config/env");
const constants_1 = require("../../../shared/constants");
// Strategy 1 — Zod validation errors
class ZodErrorHandler {
    canHandle(err) {
        return err instanceof zod_1.ZodError;
    }
    handle(err, res) {
        const zodError = err;
        const errors = zodError.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        res
            .status(constants_1.HTTP_STATUS.UNPROCESSABLE_ENTITY)
            .json(ApiResponse_1.ApiResponse.error('Validation failed', constants_1.HTTP_STATUS.UNPROCESSABLE_ENTITY, errors));
    }
}
// Strategy 2 — AppError (custom errors)
class AppErrorHandler {
    canHandle(err) {
        return err instanceof AppError_1.AppError;
    }
    handle(err, res) {
        const appError = err;
        res
            .status(appError.statusCode)
            .json(ApiResponse_1.ApiResponse.error(appError.message, appError.statusCode));
    }
}
// Strategy 3 — MongoDB duplicate key
class MongoDbDuplicateKeyHandler {
    canHandle(err) {
        return err.code === 11000;
    }
    handle(err, res) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        res
            .status(constants_1.HTTP_STATUS.CONFLICT)
            .json(ApiResponse_1.ApiResponse.error(`${field} already exists`, constants_1.HTTP_STATUS.CONFLICT));
    }
}
// Strategy 4 — Default fallback
class DefaultErrorHandler {
    canHandle(_err) {
        return true;
    }
    handle(err, res) {
        res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ApiResponse_1.ApiResponse.error(env_1.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
const errorHandlers = [
    new ZodErrorHandler(),
    new AppErrorHandler(),
    new MongoDbDuplicateKeyHandler(),
    new DefaultErrorHandler(),
];
const errorHandler = (err, req, res, _next) => {
    logger_1.logger.error(`${req.method} ${req.path} — ${err.message}`);
    // Find first strategy that can handle this error
    const handler = errorHandlers.find((h) => h.canHandle(err));
    handler?.handle(err, res);
};
exports.errorHandler = errorHandler;
