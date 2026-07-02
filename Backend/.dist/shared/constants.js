"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGINATION = exports.HTTP_STATUS = exports.ROLES = void 0;
exports.ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    TENANT_ADMIN: "TENANT_ADMIN",
    USER: "USER",
};
exports.HTTP_STATUS = {
    //Success
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    //// Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
};
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};
