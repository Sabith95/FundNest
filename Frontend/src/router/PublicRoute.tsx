// import { Navigate, Outlet } from "react-router-dom";
// import { useAppSelector } from "../store/hooks";
// import { ROUTES } from "../shared/constants";
// import type { Role } from "../types/auth.types";
// import { getTenantDestination } from "../utitls/tenantRouting";

// const getDashboardPath = (role?: Role): string =>{
//     if(role === 'SUPER_ADMIN') return ROUTES.SUPER_ADMIN.DASHBOARD
//     if(role === 'TENANT_ADMIN') return ROUTES.TENANT.DASHBOARD
//     return ROUTES.USER.DASHBOARD
// }

// // const PublicRoute = () =>{
// //     const {isAuthenticated, user} = useAppSelector((state) => state.auth)
    

// //     if(isAuthenticated) {
// //         return <Navigate to={getDashboardPath(user?.role)} replace />
// //     }

// //     return <Outlet />
// // }

// // export default PublicRoute

// const PublicRoute = () => {
//   const { isAuthenticated, user } = useAppSelector((state) => state.auth);
//   const tenant = useAppSelector((state) => state.tenant.tenant);
//   if (isAuthenticated) {
//     if (user?.role === "TENANT_ADMIN") {
//       if (tenant) {
//         return (
//           <Navigate
//             to={getTenantDestination(tenant.onboardingStep)}
//             replace
//           />
//         );
//       }
//       return <Navigate to={ROUTES.TENANT.LOGIN} replace />;
//     }
//     return <Navigate to={getDashboardPath(user?.role)} replace />;
//   }
//   return <Outlet />;
// };
// export default PublicRoute;

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { ROUTES } from "../shared/constants";
import type { Role } from "../types/auth.types";
import { getTenantDestination } from "../utitls/tenantRouting";

const LOGIN_ROLE_BY_PATH: Record<string, Role> = {
  [ROUTES.USER.LOGIN]: "USER",
  [ROUTES.TENANT.LOGIN]: "TENANT_ADMIN",
  [ROUTES.SUPER_ADMIN.LOGIN]: "SUPER_ADMIN",
};

const getDashboardPath = (role?: Role): string => {
  if (role === "SUPER_ADMIN") return ROUTES.SUPER_ADMIN.DASHBOARD;
  if (role === "TENANT_ADMIN") return ROUTES.TENANT.DASHBOARD;
  return ROUTES.USER.DASHBOARD;
};

const PublicRoute = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const tenant = useAppSelector((state) => state.tenant.tenant);

  const targetLoginRole = LOGIN_ROLE_BY_PATH[location.pathname];

  // Let a different account type sign in, even when another role has a session.
  if (targetLoginRole && user?.role !== targetLoginRole) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  if (user?.role === "TENANT_ADMIN") {
    return (
      <Navigate
        to={
          tenant
            ? getTenantDestination(tenant.onboardingStep)
            : ROUTES.TENANT.LOGIN
        }
        replace
      />
    );
  }

  return <Navigate to={getDashboardPath(user?.role)} replace />;
};

export default PublicRoute;