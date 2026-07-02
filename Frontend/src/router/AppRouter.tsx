import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../shared/constants';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

import SuperAdminLoginPage from '../pages/superAdmin/auth/LoginPage';
import SuperAdminDashboardPage from '../pages/superAdmin/dashboard/DashboardPage';

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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        
          <Route
          path='/pricing'
          element = {<PricingPage />}
          />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
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
              allowedRoles={['SUPER_ADMIN']}
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
              allowedRoles={['USER']}
              redirectTo={ROUTES.USER.LOGIN}
            />
          }
        >
          <Route
            path={ROUTES.USER.DASHBOARD}
            element={<DashboardPage />}
          />

          <Route
          path='/profile'
          element ={<ProfilePage></ProfilePage>}
          />

          <Route 
          path='/profile/info'
          element ={<ProfilePage></ProfilePage>}
          />

        </Route>
        
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
