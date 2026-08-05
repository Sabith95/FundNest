import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request'){
        super(message, HTTP_STATUS.BAD_REQUEST)
    }
}