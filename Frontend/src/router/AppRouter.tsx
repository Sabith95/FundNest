import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES, ROLES } from '../shared/constants';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
// super admin
import SuperAdminLoginPage from '../pages/superAdmin/auth/LoginPage';
import SuperAdminDashboardPage from '../pages/superAdmin/dashboard/DashboardPage';

//user
import UserRegisterPage from '../pages/user/auth/RegisterPage';
import UserLoginPage from '../pages/user/auth/LoginPage';
import OtpPage from '../pages/user/auth/OtpPage';
import ForgotPasswordPage from '../pages/user/auth/ForgotPasswordPage';
import ForgotPasswordOtpPage from '../pages/user/auth/ForgotPasswordOtpPage';
import ResetPasswordPage from '../pages/user/auth/ResetPasswordPage';


import DashboardPage from '../pages/user/dashboard/DashboardPage';
import ProfilePage from '../pages/user/profile/ProfilePage';
import LandingPage from '../pages/landing/LandingPage';
import PricingPage from '../pages/pricing/PricingPage';

//tenant

import TenantRegisterPage from '../pages/Tenant/auth/TenantRegisterPage';
import OtpVerificationPage from '../pages/Tenant/auth/OtpPage';
import BusinessSetup from '../pages/Tenant/Business/BusinessSetup';
import KycUpload from '../pages/Tenant/Kyc/KycUpload';
import BankingDetails from '../pages/Tenant/Banking/BankingDetails';
import LoginPage from '../pages/Tenant/login/LoginPage';
import TenantDashboardPage from '../pages/Tenant/Dashboard/TenantDashboardPage';
import TenantGuard from './TenantGuard';
import TenantManagement from '../pages/superAdmin/Tenant/TenantManagement';
import TenantDetailsPage from '../pages/superAdmin/Tenant/TenantDetailsPage';
// import UserManagement from '../pages/superAdmin/user/UserManagement';


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>


        {/* Public routes */}
        <Route element={<PublicRoute />}>

          <Route path={ROUTES.COMMON.LANDING} element={<LandingPage />} />

          <Route
            path={ROUTES.COMMON.PRICING}
            element={<PricingPage />}
          />

          {/* <Route path='/superadmin/users'
          element = {<UserManagement />} 
          /> */}


          <Route
            path={ROUTES.TENANT.REGISTER}
            element={<TenantRegisterPage />}
          />

          <Route
            path={ROUTES.TENANT.VERIFY_OTP}
            element={<OtpVerificationPage />} />

          <Route 
          path={ROUTES.TENANT.LOGIN}
          element = {<LoginPage />}
          />
          <Route
            path={ROUTES.SUPER_ADMIN.LOGIN}
            element={<SuperAdminLoginPage />}
          />

          <Route
            path={ROUTES.USER.LOGIN}
            element={<UserLoginPage />}
          />

          <Route
            path={ROUTES.USER.REGISTER}
            element={<UserRegisterPage />}
          />

          <Route
            path={ROUTES.USER.VERIFY_OTP}
            element={<OtpPage />}
          />

          <Route
            path={ROUTES.USER.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />

          <Route
            path={ROUTES.USER.FORGOT_PASSWORD_OTP}
            element={<ForgotPasswordOtpPage />}
          />

          <Route
            path={ROUTES.USER.RESET_PASSWORD}
            element={<ResetPasswordPage />}
          />

        </Route>

        {/* Super admin protected routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.SUPER_ADMIN]}
              redirectTo={ROUTES.SUPER_ADMIN.LOGIN}
            />
          }
        >
          <Route
            path={ROUTES.SUPER_ADMIN.DASHBOARD}
            element={<SuperAdminDashboardPage />}
          />
          <Route path="/superadmin/tenants" element={<TenantManagement />} />
          <Route path="/superadmin/tenants/:tenantId" element={<TenantDetailsPage />} />
        </Route>


        {/* user protected routes */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.USER]}
              redirectTo={ROUTES.USER.LOGIN}
            />
          }
        >
          <Route
            path={ROUTES.USER.DASHBOARD}
            element={<DashboardPage />}
          />

          <Route
            path={ROUTES.USER.PROFILE}
            element={<ProfilePage></ProfilePage>}
          />

          <Route
            path={ROUTES.USER.PROFILE_INFO}
            element={<ProfilePage></ProfilePage>}
          />

        </Route>
        

    {/* tenant protected route */}
        <Route
        
        element = {
          <ProtectedRoute
          allowedRoles={[ROLES.TENANT]}
          redirectTo={ROUTES.TENANT.LOGIN}
          />
        }
        >

          {/* <Route
          path={ROUTES.TENANT.DASHBOARD}
          element= {<TenantDashboardPage />}
          /> */}

            <Route element={<TenantGuard requireOnboardingComplete={false} />}>

            <Route
              path={ROUTES.TENANT.BUSINESS_INFO}
              element={<BusinessSetup />}
            />
            <Route
              path={ROUTES.TENANT.KYC_UPLOAD}
              element={<KycUpload />}
            />
            <Route
              path={ROUTES.TENANT.BANKING}
              element={<BankingDetails />}
            />
          </Route>

          <Route element={<TenantGuard requireOnboardingComplete={true} />}>
            <Route path={ROUTES.TENANT.DASHBOARD} element={<TenantDashboardPage />} />
          </Route>


        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
