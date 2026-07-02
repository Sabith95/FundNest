"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000').transform(Number),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    MONGO_URI: zod_1.z.string({ error: "MONGO_URI is required in .env" }),
    JWT_SECRET: zod_1.z.string().min(16, { message: 'JWT_SECRET must be at least 16 characters' }),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16, { message: 'JWT_REFRESH_SECRET must be at least 16 characters' }),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
    UPLOAD_DIR: zod_1.z.string().default('uploads'),
    MAX_FILE_SIZE_MB: zod_1.z.string().default('5').transform(Number),
    GOOGLE_CLIENT_ID: zod_1.z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
    REDIS_HOST: zod_1.z.string().default("127.0.0.1"),
    REDIS_PORT: zod_1.z.string().default("6379").transform(Number),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    OTP_EXPIRES_IN_SECONDS: zod_1.z.string().default("60").transform(Number),
    OTP_MAX_ATTEMPTS: zod_1.z.string().default("5").transform(Number),
    SMTP_HOST: zod_1.z.string().min(1, "SMTP_HOST is required"),
    SMTP_PORT: zod_1.z.string().default("587").transform(Number),
    SMTP_SECURE: zod_1.z
        .string()
        .default("false")
        .transform((value) => value === "true"),
    SMTP_USER: zod_1.z.string().min(1, "SMTP_USER is required"),
    SMTP_PASS: zod_1.z.string().min(1, "SMTP_PASS is required"),
    SMTP_FROM_NAME: zod_1.z.string().default("FundNest"),
    SMTP_FROM_EMAIL: zod_1.z.string().email("SMTP_FROM_EMAIL must be valid"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.log(`invalid environment variables:\n`);
    parsed.error.issues.forEach((issue) => {
        console.error(`  ${issue.path.join('.')} : ${issue.message}`);
    });
    process.exit(1);
}
exports.env = parsed.data;
