import type { Role } from "../types/auth.types";

export interface DecodedAccessToken {
  id: string;
  email: string;
  role: Role;
  name?: string;
  tenantId?: string;
}

const normalizeRole = (role: unknown): Role => {
  if (typeof role !== "string") {
    throw new Error("Access token role is invalid");
  }

  const normalizedRole = role.trim().toUpperCase().replace(/[\s-]/g, "_");

  if (normalizedRole === "SUPERADMIN" || normalizedRole === "SUPER_ADMIN") {
    return "SUPER_ADMIN";
  }

  if (
    normalizedRole === "TENANT" ||
    normalizedRole === "TENANTADMIN" ||
    normalizedRole === "TENANT_ADMIN"
  ) {
    return "TENANT_ADMIN";
  }

  if (normalizedRole === "USER") {
    return "USER";
  }

  throw new Error("Access token role is not supported");
};

export const decodeAccessToken = (token: string): DecodedAccessToken => {
  const payload = token.split(".")[1];

  if (!payload) {
    throw new Error("Invalid access token");
  }

  const normalizedPayload = payload
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(payload.length / 4) * 4, "=");

  const decoded = JSON.parse(atob(normalizedPayload)) as {
    id?: string;
    email?: string;
    role?: unknown;
    name?: string;
    tenantId?: string;
  };

  if (!decoded.id || !decoded.email || !decoded.role) {
    throw new Error("Access token payload is missing auth fields");
  }

  return {
    id: decoded.id,
    email: decoded.email,
    role: normalizeRole(decoded.role),
    name: decoded.name,
    tenantId: decoded.tenantId,
  };
};