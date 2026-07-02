import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSuccess, logout } from '../store/slices/authSlice';
import { ROUTES } from '../shared/constants';
import type { IUser, Role } from '../types/auth.types';
import { refreshAccessToken } from '../services/api';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  redirectTo?: string;
}

interface RawJwtPayload {
  id: string;
  email: string;
  role: unknown;
  name?: string;
  tenantId?: string;
}

interface JwtPayload extends Omit<RawJwtPayload, 'role'> {
  role: Role;
}

const normalizeRole = (role: unknown): Role => {
  if (typeof role !== 'string') {
    throw new Error('Access token role is invalid');
  }

  const normalizedRole = role.trim().toUpperCase().replace(/[\s-]/g, '_');

  if (normalizedRole === 'SUPERADMIN' || normalizedRole === 'SUPER_ADMIN') {
    return 'SUPER_ADMIN';
  }

  if (normalizedRole === 'TENANT' || normalizedRole === 'TENANTADMIN' || normalizedRole === 'TENANT_ADMIN') {
    return 'TENANT_ADMIN';
  }

  if (normalizedRole === 'USER') {
    return 'USER';
  }

  throw new Error('Access token role is not supported');
};

const decodeTokenPayload = (token: string): JwtPayload => {
  const payload = token.split('.')[1];

  if (!payload) {
    throw new Error('Invalid access token');
  }

  const normalizedPayload = payload
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(payload.length / 4) * 4, '=');
  const decodedPayload = JSON.parse(atob(normalizedPayload)) as RawJwtPayload;

  if (!decodedPayload.id || !decodedPayload.email || !decodedPayload.role) {
    throw new Error('Access token payload is missing auth fields');
  }

  return {
    ...decodedPayload,
    role: normalizeRole(decodedPayload.role),
  };
};

const mapPayloadToUser = (payload: JwtPayload): IUser => ({
  id: payload.id,
  name: payload.name ?? payload.email,
  email: payload.email,
  role: payload.role,
  tenantId: payload.tenantId,
  isActive: true,
  createdAt: '',
});

const ProtectedRoute = ({
  allowedRoles,
  redirectTo = ROUTES.USER.LOGIN,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isRestoringSession, setIsRestoringSession] = useState(!isAuthenticated);
  const [restoredUser, setRestoredUser] = useState<IUser | null>(null);
  const activeUser = user ?? restoredUser;
  const hasAuthenticatedSession = isAuthenticated || Boolean(restoredUser);
  const hasRoleMismatch = Boolean(
    allowedRoles &&
    hasAuthenticatedSession &&
    activeUser?.role &&
    !allowedRoles.includes(activeUser.role)
  );

  useEffect(() => {
    if (isAuthenticated && !hasRoleMismatch) {
      setIsRestoringSession(false);
      return;
    }

    let isMounted = true;

    const restoreSession = async (): Promise<void> => {
      if (hasRoleMismatch) {
        setIsRestoringSession(true);
      }

      try {
        const accessToken = await refreshAccessToken(allowedRoles?.[0]);
        const payload = decodeTokenPayload(accessToken);
        const restoredAuthUser = mapPayloadToUser(payload);

        if (!isMounted) return;

        setRestoredUser(restoredAuthUser);
        dispatch(loginSuccess({
          user: restoredAuthUser,
          accessToken,
        }));
      } catch {
        if (!isMounted) return;

        setRestoredUser(null);
        dispatch(logout());
      } finally {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles, dispatch, hasRoleMismatch, isAuthenticated]);

  if (isRestoringSession) {
    return null;
  }

  if (!hasAuthenticatedSession) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (hasRoleMismatch) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
