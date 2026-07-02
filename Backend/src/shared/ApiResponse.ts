import { ISuccessResponse, IErrorResponse } from './interfaces/IApiResponse';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class ApiResponse {

  static success<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    pagination?: PaginationMeta
  ): ISuccessResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
      ...(pagination && { pagination }),
    };
  }

  static error(
    message: string,
    statusCode: number = 500,
    errors?: any
  ): IErrorResponse {
    return {
      success: false,
      statusCode,
      message,
      ...(errors && { errors }),
    };
  }

  static paginate<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Success'
  ): ISuccessResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    return this.success(data, message, 200, {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    });
  }
}