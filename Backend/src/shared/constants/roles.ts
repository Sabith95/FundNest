export const ROLES = {
    SUPER_ADMIN:'SUPER_ADMIN',
    TENANT_ADMIN:"TENANT_ADMIN",
    USER:"USER",
}as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

