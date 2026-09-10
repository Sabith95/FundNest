import { Response } from "express";
import { ApiResponse } from "./ApiResponse";

export class ResponseHandler {
  static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T,
  ): Response {
    return res
      .status(statusCode)
      .json(ApiResponse.success(data, message, statusCode));
  }

  static error(
    res: Response,
    statusCode: number,
    message: string,
    errors?: unknown,
  ): Response {
    return res
      .status(statusCode)
      .json(ApiResponse.error(message, statusCode, errors));
  }
}
