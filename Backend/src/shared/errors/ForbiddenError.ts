import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}
