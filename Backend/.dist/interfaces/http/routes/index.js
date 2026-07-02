"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApiResponse_1 = require("../../../shared/ApiResponse");
const env_1 = require("../../../config/env");
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
const userRoutes_1 = __importDefault(require("../routes/user/userRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/users', userRoutes_1.default);
// Health check
router.get('/health', (_req, res) => {
    res.status(200).json(ApiResponse_1.ApiResponse.success({
        status: 'healthy',
        timeStamp: new Date().toISOString(),
        upTime: `${Math.floor(process.uptime())}`,
        enviornment: env_1.env.NODE_ENV,
    }, 'FundNest Api is running'));
});
exports.default = router;
