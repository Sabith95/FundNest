import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }
}
