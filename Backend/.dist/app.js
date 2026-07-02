"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cors_2 = require("./config/cors");
const requestLogger_1 = require("./interfaces/http/middleware/requestLogger");
const errorHandler_1 = require("./interfaces/http/middleware/errorHandler");
const notFound_1 = require("./interfaces/http/middleware/notFound");
const index_1 = __importDefault(require("./interfaces/http/routes/index"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)(cors_2.corsOptions));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use(requestLogger_1.requestLogger);
    app.use('/uploads', express_1.default.static('uploads'));
    app.use('/api/v1', index_1.default);
    app.use(notFound_1.notFound);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.default = createApp;
