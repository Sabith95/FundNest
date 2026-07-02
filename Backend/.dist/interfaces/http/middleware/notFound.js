"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const ApiResponse_1 = require("../../../shared/ApiResponse");
const constants_1 = require("../../../shared/constants");
const notFound = (req, res) => {
    const response = res;
    response
        .status(constants_1.HTTP_STATUS.NOT_FOUND)
        .json(ApiResponse_1.ApiResponse.error(`Route ${req.method} ${req.path} not found`, constants_1.HTTP_STATUS.NOT_FOUND));
};
exports.notFound = notFound;
