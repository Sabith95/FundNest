import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '../../../shared/ApiResponse';
import { AppError } from '../../../shared/errors/AppError';
import { logger } from '../../../shared/logger';
import { env } from '../../../config/env';
import { HTTP_STATUS } from '../../../shared/constants';


interface IErrorHandlerStrategy{
  canHandle(err: Error): boolean
  handle(err: Error, res: Response): void
}

// Strategy 1 — Zod validation errors
class ZodErrorHandler implements IErrorHandlerStrategy {
  canHandle(err: Error): boolean {
    return err instanceof ZodError;
  }

  handle(err: Error, res: Response): void {
    const zodError = err as ZodError;
    const errors = zodError.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    (res as any)
      .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      .json(ApiResponse.error('Validation failed', HTTP_STATUS.UNPROCESSABLE_ENTITY, errors));
  }
}

// Strategy 2 — AppError (custom errors)
class AppErrorHandler implements IErrorHandlerStrategy {
  canHandle(err: Error): boolean {
    return err instanceof AppError;
  }

  handle(err: Error, res: Response): void {
    const appError = err as AppError;
    (res as any)
      .status(appError.statusCode)
      .json(ApiResponse.error(appError.message, appError.statusCode));
  }
}

// Strategy 3 — MongoDB duplicate key
class MongoDbDuplicateKeyHandler implements IErrorHandlerStrategy {
  canHandle(err: Error): boolean {
    return (err as any).code === 11000;
  }

  handle(err: Error, res: Response): void {
    const field =
      Object.keys((err as any).keyValue || {})[0] || 'field';
    (res as any)
      .status(HTTP_STATUS.CONFLICT)
      .json(ApiResponse.error(`${field} already exists`, HTTP_STATUS.CONFLICT));
  }
}

// Strategy 4 — Default fallback
class DefaultErrorHandler implements IErrorHandlerStrategy {
  canHandle(_err: Error): boolean {
    return true;  
  }

  handle(err: Error, res: Response): void {
    (res as any).status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      ApiResponse.error(
        env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
}


const errorHandlers: IErrorHandlerStrategy[] = [
  new ZodErrorHandler(),
  new AppErrorHandler(),
  new MongoDbDuplicateKeyHandler(),
  new DefaultErrorHandler(),   
];

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`${req.method} ${req.path} — ${err.message}`);

  // Find first strategy that can handle this error
  const handler = errorHandlers.find((h) => h.canHandle(err));
  handler?.handle(err, res);
};