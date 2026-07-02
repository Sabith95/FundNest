"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../../../infrastructure/container/container");
const AuthController_1 = require("../../controllers/auth/AuthController");
const router = (0, express_1.Router)();
const authController = container_1.container.resolve(AuthController_1.AuthController);
// super admin login
router.post("/super-admin/login", authController.loginSuperAdmin);
exports.default = router;
