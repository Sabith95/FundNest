import {z} from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
    PORT:z.string().default('5000').transform(Number),
    NODE_ENV:z.enum(['development','production','test']).default('development'),
    MONGO_URI:z.string({error:"MONGO_URI is required in .env"}),
    JWT_SECRET:z.string().min(16,{message:'JWT_SECRET must be at least 16 characters'}),
    JWT_REFRESH_SECRET: z.string().min(16, { message: 'JWT_REFRESH_SECRET must be at least 16 characters' }),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    UPLOAD_DIR: z.string().default('uploads'),
    MAX_FILE_SIZE_MB: z.string().default('5').transform(Number),
    GOOGLE_CLIENT_ID:z.string().min(1,'GOOGLE_CLIENT_ID is required'),
    REDIS_HOST: z.string().default("127.0.0.1"),
    REDIS_PORT: z.string().default("6379").transform(Number),
    REDIS_PASSWORD: z.string().optional(),
    OTP_EXPIRES_IN_SECONDS: z.string().default("60").transform(Number),
    OTP_MAX_ATTEMPTS: z.string().default("5").transform(Number),
    SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
    SMTP_PORT: z.string().default("587").transform(Number),
    SMTP_SECURE: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
    SMTP_USER: z.string().min(1, "SMTP_USER is required"),
    SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
    SMTP_FROM_NAME: z.string().default("FundNest"),
    SMTP_FROM_EMAIL: z.string().email("SMTP_FROM_EMAIL must be valid"),
    CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
    CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
    CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
    CLOUDINARY_FOLDER: z.string().default("fundnest/profile-photos"),
    AWS_REGION: z.string().min(1, "AWS_REGION is required"),
    AWS_BUCKET_NAME: z.string().min(1, "AWS_S3_BUCKET_NAME is required"),
    AWS_ACCESS_KEY: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
    AWS_SECRET_KEY: z.string()
        .min(1, "AWS_SECRET_ACCESS_KEY is required"),
})

const parsed = envSchema.safeParse(process.env)

if(!parsed.success){
   console.error("invalid environment variables:")
    parsed.error.issues.forEach((issue) =>{
        console.error(`  ${issue.path.join('.')} : ${issue.message}`)
    })
    process.exit(1)
}

export const env = parsed.data
export type Env = typeof env