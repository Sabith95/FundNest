import { PaginationMeta } from '../ApiResponse';

export interface ISuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface IErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: any;
}

export type ApiResponseType<T> = ISuccessResponse<T> | IErrorResponse;