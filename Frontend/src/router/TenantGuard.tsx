import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { ROUTES } from "../shared/constants";
import { getTenantDestination, isOnboardingComplete } from '../utitls/tenantRouting'

interface TenantGuardProps {
  /** true = dashboard routes, false = onboarding routes */
  requireOnboardingComplete: boolean;
}

const TenantGuard = ({ requireOnboardingComplete }: TenantGuardProps) => {
  const location = useLocation();
  const tenant = useAppSelector((state) => state.tenant.tenant);

  if (!tenant) {
    return <Navigate to={ROUTES.TENANT.LOGIN} replace state={{ from: location }} />;
  }

  const onboardingComplete = isOnboardingComplete(tenant.onboardingStep);
  const expectedPath = getTenantDestination(tenant.onboardingStep);

  if (requireOnboardingComplete && !onboardingComplete) {
    return <Navigate to={expectedPath} replace />;
  }

  if (!requireOnboardingComplete && onboardingComplete) {
    return <Navigate to={ROUTES.TENANT.DASHBOARD} replace />;
  }

  if (!requireOnboardingComplete && location.pathname !== expectedPath) {
    return <Navigate to={expectedPath} replace />;
  }

  return <Outlet />;
};

export default TenantGuard;