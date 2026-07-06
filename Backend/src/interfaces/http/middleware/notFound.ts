import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/ApiResponse';
import { HTTP_STATUS } from '../../../shared/constants/httpStatus';

export const notFound = (req: Request, res: Response): void => {
  const response = res as any;
  response
    .status(HTTP_STATUS.NOT_FOUND)
    .json(
      ApiResponse.error(
        `Route ${req.method} ${req.path} not found`,
        HTTP_STATUS.NOT_FOUND
      )
    );
};