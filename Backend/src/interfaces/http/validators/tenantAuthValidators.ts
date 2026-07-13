import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

export const registerTenantSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, "Company name is required")
      .max(100, "Company name is too long"),

    ownerName: z
      .string()
      .trim()
      .min(2, "Owner name is required")
      .max(100, "Owner name is too long"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Invalid phone number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const verifyTenantOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),

  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits"),
});

export const resendTenantOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),
});