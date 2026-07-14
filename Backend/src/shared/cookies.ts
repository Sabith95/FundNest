import { CookieOptions } from "express";
import { env } from "../config/env";

export const LEGACY_REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export const REFRESH_TOKEN_COOKIE_NAMES = {
  USER: "userRefreshToken",
  SUPER_ADMIN: "superAdminRefreshToken",
  TENANT: "tenantRefreshToken",
} as const;

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  path: "/",
};
