import axios from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { Role } from "../types/auth.types";

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const AUTH_SCOPE = {
    USER: 'user',
    SUPER_ADMIN: 'super-admin',
} as const

type AuthScope = (typeof AUTH_SCOPE)[keyof typeof AUTH_SCOPE]

const ACCESS_TOKEN_KEYS: Record<AuthScope, string> = {
    [AUTH_SCOPE.USER]: 'userAccessToken',
    [AUTH_SCOPE.SUPER_ADMIN]: 'superAdminAccessToken',
}

const refreshTokenRequests: Partial<Record<AuthScope, Promise<string>>> = {}

const getAuthScopeFromRole = (role?: Role): AuthScope => {
    return role === 'SUPER_ADMIN' ? AUTH_SCOPE.SUPER_ADMIN : AUTH_SCOPE.USER
}

const getAuthScopeFromPath = (path: string = window.location.pathname): AuthScope => {
    return path.startsWith('/superadmin') ? AUTH_SCOPE.SUPER_ADMIN : AUTH_SCOPE.USER
}

const getAuthScopeFromRequest = (url?: string): AuthScope => {
    if(url?.includes('/auth/super-admin')) {
        return AUTH_SCOPE.SUPER_ADMIN
    }

    return getAuthScopeFromPath()
}

export const getAccessTokenKey = (roleOrScope?: Role | AuthScope): string => {
    if(roleOrScope === AUTH_SCOPE.SUPER_ADMIN || roleOrScope === AUTH_SCOPE.USER) {
        return ACCESS_TOKEN_KEYS[roleOrScope]
    }

    return ACCESS_TOKEN_KEYS[getAuthScopeFromRole(roleOrScope)]
}

export const getCurrentAccessToken = (scope: AuthScope = getAuthScopeFromPath()): string | null => {
    return sessionStorage.getItem(ACCESS_TOKEN_KEYS[scope])
}

export const setAccessToken = (accessToken: string, roleOrScope?: Role | AuthScope): void => {
    sessionStorage.setItem(getAccessTokenKey(roleOrScope), accessToken)
    sessionStorage.setItem('accessToken', accessToken)
}

export const removeAccessToken = (roleOrScope?: Role | AuthScope): void => {
    sessionStorage.removeItem(getAccessTokenKey(roleOrScope))
    sessionStorage.removeItem('accessToken')
}

const getRefreshTokenEndpoint = (scope: AuthScope): string => {
    return `/auth/${scope}/refresh-token`
}

const getLoginRedirectPath = (): string => {
    const currentPath = window.location.pathname

    if(currentPath.startsWith('/superadmin')) {
        return '/superadmin/login'
    }

    if(currentPath.startsWith('/tenant')) {
        return '/tenant/login'
    }

    return '/login'
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const refreshAccessToken = async (roleOrScope?: Role | AuthScope): Promise<string> => {
    const scope =
        roleOrScope === AUTH_SCOPE.SUPER_ADMIN || roleOrScope === AUTH_SCOPE.USER
            ? roleOrScope
            : getAuthScopeFromRole(roleOrScope)

    if(refreshTokenRequests[scope]) {
        return refreshTokenRequests[scope]
    }

    refreshTokenRequests[scope] = axios.post(
            `${import.meta.env.VITE_API_URL}${getRefreshTokenEndpoint(scope)}`,
            {},
            {withCredentials: true}
        )
        .then((response) => {
            const newToken = response.data.data.accessToken
            if(!newToken) {
                throw new Error('Refresh response did not include an access token')
            }

            setAccessToken(newToken, scope)
            return newToken
        })
        .finally(() => {
            delete refreshTokenRequests[scope]
        })

    return refreshTokenRequests[scope]
}

// Attatch access token to every request

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) =>{
        const token = getCurrentAccessToken(getAuthScopeFromRequest(config.url))
        if(token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Handle 401- refresh token automatically

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) =>{
        const originalRequest = error.config as RetriableRequestConfig | undefined

        const isLoginRequest = originalRequest?.url?.includes(`/auth/super-admin/login`) ||
        originalRequest?.url?.includes(`/tenant/login`) ||
        originalRequest?.url?.includes(`/users/login`);
        
        const isGoogleLoginRequest = originalRequest?.url?.includes(`/users/google`)
        const isRefreshRequest = originalRequest?.url?.includes(`/refresh-token`)
        const isLogoutRequest = originalRequest?.url?.includes(`/logout`)

        if(isLoginRequest || isGoogleLoginRequest || isRefreshRequest || isLogoutRequest || !originalRequest){
            return Promise.reject(error)
        }

        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
        

        try {
            const requestScope = getAuthScopeFromRequest(originalRequest.url)
            const newToken = await refreshAccessToken(requestScope)
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`)

            return api(originalRequest)
        } catch {
            removeAccessToken(getAuthScopeFromRequest(originalRequest.url))
            window.location.href = getLoginRedirectPath()
        }
    }

    return Promise.reject(error)
}
)

export default api
