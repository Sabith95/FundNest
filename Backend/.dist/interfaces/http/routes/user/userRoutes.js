"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../../../infrastructure/container/container");
const AuthController_1 = require("../../controllers/auth/AuthController");
const router = (0, express_1.Router)();
const authController = container_1.container.resolve(AuthController_1.AuthController);
router.post("/register", authController.registerUser);
router.post("/register/verify-otp", authController.verifyUserOtp);
router.post('/register/resend-otp', authController.resendUserOtp);
//forgot password
router.post('/forgot-password/send-otp', authController.requestPasswordResetOtp);
router.post('/forgot-password/resend-otp', authController.requestPasswordResetOtp);
router.post('/forgot-password/verify-otp', authController.verifyPasswordResetOtp);
router.post('/forgot-password/reset', authController.resetUserPassword);
// user google login
router.post('/google', authController.googleUserLogin);
exports.default = router;
