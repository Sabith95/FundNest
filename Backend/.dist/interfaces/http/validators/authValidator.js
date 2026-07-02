"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.resendOtpSchema = exports.verifyOtpSchema = exports.googleLoginSchema = exports.registerUserSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    password: zod_1.z.string().min(1, "Password is required"),
});
const strongPasswordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`;']/, "Password must contain at least one special character");
exports.registerUserSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.email().trim().toLowerCase(),
    phone: zod_1.z.string().trim().optional(),
    password: strongPasswordSchema,
    confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
    address: zod_1.z
        .object({
        line1: zod_1.z.string().trim().optional(),
        line2: zod_1.z.string().trim().optional(),
        city: zod_1.z.string().trim().optional(),
        state: zod_1.z.string().trim().optional(),
        pincode: zod_1.z.string().trim().optional(),
        country: zod_1.z.string().trim().optional(),
    })
        .optional(),
})
    .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});
exports.googleLoginSchema = zod_1.z.object({
    idToken: zod_1.z.string().min(1, "Google token is required"),
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
});
exports.resendOtpSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
});
exports.resetPasswordSchema = zod_1.z
    .object({
    email: zod_1.z.email().trim().toLowerCase(),
    password: strongPasswordSchema,
    confirmPassword: zod_1.z.string().min(1, 'Confirm password is required'),
})
    .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
});
