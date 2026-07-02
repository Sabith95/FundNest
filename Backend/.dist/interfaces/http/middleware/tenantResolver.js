"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantResolver = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const constants_1 = require("../../../shared/constants");
const constants_2 = require("../../../shared/constants");
const tenantResolver = (req, res, next) => {
    if (req.user?.role === constants_2.ROLES.SUPER_ADMIN) {
        next();
        return;
    }
    let tenantId = req.user?.tenantId;
    if (!tenantId) {
        tenantId = req.headers['x-tenant-id'];
    }
    if (!tenantId) {
        next(new AppError_1.AppError('Tenant ID is required', constants_1.HTTP_STATUS.BAD_REQUEST));
        return;
    }
    req.tenantId = tenantId;
    next();
};
exports.tenantResolver = tenantResolver;
