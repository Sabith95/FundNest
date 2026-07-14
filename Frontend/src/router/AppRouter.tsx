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

          <Route
            path={ROUTES.TENANT.REGISTER}
            element={<TenantRegisterPage />}
          />

          <Route
            path={ROUTES.TENANT.VERIFY_OTP}
            element={<OtpVerificationPage />} />

          <Route 
          path = {ROUTES.TENANT.BUSINESS_INFO}
          element = {<BusinessSetup />}
          />

          <Route 
          path={ROUTES.TENANT.KYC_UPLOAD}
          element = {<KycUpload />}
          
          />

          <Route
          path={ROUTES.TENANT.BANKING}
          element = {<BankingDetails />}
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


      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
