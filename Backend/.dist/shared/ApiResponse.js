"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(data, message = 'Success', statusCode = 200, pagination) {
        return {
            success: true,
            statusCode,
            message,
            data,
            ...(pagination && { pagination }),
        };
    }
    static error(message, statusCode = 500, errors) {
        return {
            success: false,
            statusCode,
            message,
            ...(errors && { errors }),
        };
    }
    static paginate(data, total, page, limit, message = 'Success') {
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
exports.ApiResponse = ApiResponse;
