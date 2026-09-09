// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { ROUTES, ROLES } from '../shared/constants';

// import PublicRoute from './PublicRoute';
// import ProtectedRoute from './ProtectedRoute';
// // super admin
// import SuperAdminLoginPage from '../pages/superAdmin/auth/LoginPage';
// import SuperAdminDashboardPage from '../pages/superAdmin/dashboard/DashboardPage';

// //user
// import UserRegisterPage from '../pages/user/auth/RegisterPage';
// import UserLoginPage from '../pages/user/auth/LoginPage';
// import OtpPage from '../pages/user/auth/OtpPage';
// import ForgotPasswordPage from '../pages/user/auth/ForgotPasswordPage';
// import ForgotPasswordOtpPage from '../pages/user/auth/ForgotPasswordOtpPage';
// import ResetPasswordPage from '../pages/user/auth/ResetPasswordPage';


// import DashboardPage from '../pages/user/dashboard/DashboardPage';
// import ProfilePage from '../pages/user/profile/ProfilePage';
// import LandingPage from '../pages/landing/LandingPage';
// import PricingPage from '../pages/pricing/PricingPage';

// //tenant

// import TenantRegisterPage from '../pages/Tenant/auth/TenantRegisterPage';
// import OtpVerificationPage from '../pages/Tenant/auth/OtpPage';
// import BusinessSetup from '../pages/Tenant/Business/BusinessSetup';
// import KycUpload from '../pages/Tenant/Kyc/KycUpload';
// import BankingDetails from '../pages/Tenant/Banking/BankingDetails';
// import LoginPage from '../pages/Tenant/login/LoginPage';
// import TenantDashboardPage from '../pages/Tenant/Dashboard/TenantDashboardPage';
// import TenantGuard from './TenantGuard';
// import TenantManagement from '../pages/superAdmin/Tenant/TenantManagement';
// import TenantDetailsPage from '../pages/superAdmin/Tenant/TenantDetailsPage';
// import UserManagement from '../pages/superAdmin/user/UserManagement';
// import KycReview from '../pages/superAdmin/Tenant/KycReview';
// import UserLandingPage from '../pages/landing/UserLandingPage';
// import TenantLandingPage from '../pages/landing/TenantLandingPage';


// const AppRouter = () => {
//   return (
//     <BrowserRouter>
//       <Routes>


//         {/* Public routes */}
//         <Route element={<PublicRoute />}>

//           <Route path={ROUTES.COMMON.LANDING} element={<LandingPage />} />
//           <Route path={ROUTES.USER.LANDING} element = {<UserLandingPage />} />
//           <Route path={ROUTES.TENANT.LANDING} element = {<TenantLandingPage />} />

//           <Route
//             path={ROUTES.COMMON.PRICING}
//             element={<PricingPage />}
//           />
//           <Route
//             path={ROUTES.TENANT.REGISTER}
//             element={<TenantRegisterPage />}
//           />

//           <Route
//             path={ROUTES.TENANT.VERIFY_OTP}
//             element={<OtpVerificationPage />} />

//           <Route 
//           path={ROUTES.TENANT.LOGIN}
//           element = {<LoginPage />}
//           />
//           <Route
//             path={ROUTES.SUPER_ADMIN.LOGIN}
//             element={<SuperAdminLoginPage />}
//           />

//           <Route
//             path={ROUTES.USER.LOGIN}
//             element={<UserLoginPage />}
//           />

//           <Route
//             path={ROUTES.USER.REGISTER}
//             element={<UserRegisterPage />}
//           />

//           <Route
//             path={ROUTES.USER.VERIFY_OTP}
//             element={<OtpPage />}
//           />

//           <Route
//             path={ROUTES.USER.FORGOT_PASSWORD}
//             element={<ForgotPasswordPage />}
//           />

//           <Route
//             path={ROUTES.USER.FORGOT_PASSWORD_OTP}
//             element={<ForgotPasswordOtpPage />}
//           />

//           <Route
//             path={ROUTES.USER.RESET_PASSWORD}
//             element={<ResetPasswordPage />}
//           />

//         </Route>

//         {/* Super admin protected routes */}
//         <Route
//           element={
//             <ProtectedRoute
//               allowedRoles={[ROLES.SUPER_ADMIN]}
//               redirectTo={ROUTES.SUPER_ADMIN.LOGIN}
//             />
//           }
//         >
//           <Route
//             path={ROUTES.SUPER_ADMIN.DASHBOARD}
//             element={<SuperAdminDashboardPage />}
//           />
//           <Route path={ROUTES.SUPER_ADMIN.TENANT_MANAGEMENT} element={<TenantManagement />} />
//           <Route path={ROUTES.SUPER_ADMIN.TENANT_DETAILS} element={<TenantDetailsPage />} />
//           <Route path={ROUTES.SUPER_ADMIN.USER_MANAGEMENT} element = {<UserManagement />} />
//           <Route path={ROUTES.SUPER_ADMIN.KYC} element = {<KycReview />}
          
//           />
//         </Route>


//         {/* user protected routes */}

//         <Route
//           element={
//             <ProtectedRoute
//               allowedRoles={[ROLES.USER]}
//               redirectTo={ROUTES.USER.LOGIN}
//             />
//           }
//         >
//           <Route
//             path={ROUTES.USER.DASHBOARD}
//             element={<DashboardPage />}
//           />

//           <Route
//             path={ROUTES.USER.PROFILE}
//             element={<ProfilePage></ProfilePage>}
//           />

//           <Route
//             path={ROUTES.USER.PROFILE_INFO}
//             element={<ProfilePage></ProfilePage>}
//           />

//         </Route>
        

//     {/* tenant protected route */}
//         <Route
        
//         element = {
//           <ProtectedRoute
//           allowedRoles={[ROLES.TENANT]}
//           redirectTo={ROUTES.TENANT.LOGIN}
//           />
//         }
//         >

//           {/* <Route
//           path={ROUTES.TENANT.DASHBOARD}
//           element= {<TenantDashboardPage />}
//           /> */}

//             <Route element={<TenantGuard requireOnboardingComplete={false} />}>

//             <Route
//               path={ROUTES.TENANT.BUSINESS_INFO}
//               element={<BusinessSetup />}
//             />
//             <Route
//               path={ROUTES.TENANT.KYC_UPLOAD}
//               element={<KycUpload />}
//             />
//             <Route
//               path={ROUTES.TENANT.BANKING}
//               element={<BankingDetails />}
//             />
//           </Route>

//           <Route element={<TenantGuard requireOnboardingComplete={true} />}>
//             <Route path={ROUTES.TENANT.DASHBOARD} element={<TenantDashboardPage />} />
//           </Route>


//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRouter;



import  { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES, ROLES } from '../shared/constants';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import TenantGuard from './TenantGuard';
import ErrorBoundary from '../components/common/ErrorBoundary';
import PageLoader from '../components/common/PageLoader';
import {lazyWithRetry} from '../utitls/lazyWithRetry'

// Super Admin Pages (Lazy Loaded)
const SuperAdminLoginPage = lazyWithRetry(() => import('../pages/superAdmin/auth/LoginPage'));
const SuperAdminDashboardPage = lazyWithRetry(() => import('../pages/superAdmin/dashboard/DashboardPage'));
const TenantManagement = lazyWithRetry(() => import('../pages/superAdmin/Tenant/TenantManagement'));
const TenantDetailsPage = lazyWithRetry(() => import('../pages/superAdmin/Tenant/TenantDetailsPage'));
const UserManagement = lazyWithRetry(() => import('../pages/superAdmin/user/UserManagement'));
const KycReview = lazyWithRetry(() => import('../pages/superAdmin/Tenant/KycReview'));

// User Pages (Lazy Loaded)
const UserRegisterPage = lazyWithRetry(() => import('../pages/user/auth/RegisterPage'));
const UserLoginPage = lazyWithRetry(() => import('../pages/user/auth/LoginPage'));
const OtpPage = lazyWithRetry(() => import('../pages/user/auth/OtpPage'));
const ForgotPasswordPage = lazyWithRetry(() => import('../pages/user/auth/ForgotPasswordPage'));
const ForgotPasswordOtpPage = lazyWithRetry(() => import('../pages/user/auth/ForgotPasswordOtpPage'));
const ResetPasswordPage = lazyWithRetry(() => import('../pages/user/auth/ResetPasswordPage'));
const DashboardPage = lazyWithRetry(() => import('../pages/user/dashboard/DashboardPage'));
const ProfilePage = lazyWithRetry(() => import('../pages/user/profile/ProfilePage'));

// Common & Landing Pages (Lazy Loaded)
const LandingPage = lazyWithRetry(() => import('../pages/landing/LandingPage'));
const UserLandingPage = lazyWithRetry(() => import('../pages/landing/UserLandingPage'));
const TenantLandingPage = lazyWithRetry(() => import('../pages/landing/TenantLandingPage'));
const PricingPage = lazyWithRetry(() => import('../pages/pricing/PricingPage'));
const NotFoundPage = lazyWithRetry(() => import('../pages/common/NotFoundPage'));

// Tenant Pages (Lazy Loaded)
const TenantRegisterPage = lazyWithRetry(() => import('../pages/Tenant/auth/TenantRegisterPage'));
const OtpVerificationPage = lazyWithRetry(() => import('../pages/Tenant/auth/OtpPage'));
const BusinessSetup = lazyWithRetry(() => import('../pages/Tenant/Business/BusinessSetup'));
const KycUpload = lazyWithRetry(() => import('../pages/Tenant/Kyc/KycUpload'));
const BankingDetails = lazyWithRetry(() => import('../pages/Tenant/Banking/BankingDetails'));
const LoginPage = lazyWithRetry(() => import('../pages/Tenant/login/LoginPage'));
const TenantDashboardPage = lazyWithRetry(() => import('../pages/Tenant/Dashboard/TenantDashboardPage'));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path={ROUTES.COMMON.LANDING} element={<LandingPage />} />
              <Route path={ROUTES.USER.LANDING} element={<UserLandingPage />} />
              <Route path={ROUTES.TENANT.LANDING} element={<TenantLandingPage />} />
              <Route path={ROUTES.COMMON.PRICING} element={<PricingPage />} />
              <Route path={ROUTES.TENANT.REGISTER} element={<TenantRegisterPage />} />
              <Route path={ROUTES.TENANT.VERIFY_OTP} element={<OtpVerificationPage />} />
              <Route path={ROUTES.TENANT.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.SUPER_ADMIN.LOGIN} element={<SuperAdminLoginPage />} />
              <Route path={ROUTES.USER.LOGIN} element={<UserLoginPage />} />
              <Route path={ROUTES.USER.REGISTER} element={<UserRegisterPage />} />
              <Route path={ROUTES.USER.VERIFY_OTP} element={<OtpPage />} />
              <Route path={ROUTES.USER.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTES.USER.FORGOT_PASSWORD_OTP} element={<ForgotPasswordOtpPage />} />
              <Route path={ROUTES.USER.RESET_PASSWORD} element={<ResetPasswordPage />} />
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
              <Route path={ROUTES.SUPER_ADMIN.DASHBOARD} element={<SuperAdminDashboardPage />} />
              <Route path={ROUTES.SUPER_ADMIN.TENANT_MANAGEMENT} element={<TenantManagement />} />
              <Route path={ROUTES.SUPER_ADMIN.TENANT_DETAILS} element={<TenantDetailsPage />} />
              <Route path={ROUTES.SUPER_ADMIN.USER_MANAGEMENT} element={<UserManagement />} />
              <Route path={ROUTES.SUPER_ADMIN.KYC} element={<KycReview />} />
            </Route>

            {/* User protected routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.USER]}
                  redirectTo={ROUTES.USER.LOGIN}
                />
              }
            >
              <Route path={ROUTES.USER.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.USER.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.USER.PROFILE_INFO} element={<ProfilePage />} />
            </Route>

            {/* Tenant protected routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.TENANT]}
                  redirectTo={ROUTES.TENANT.LOGIN}
                />
              }
            >
              <Route element={<TenantGuard requireOnboardingComplete={false} />}>
                <Route path={ROUTES.TENANT.BUSINESS_INFO} element={<BusinessSetup />} />
                <Route path={ROUTES.TENANT.KYC_UPLOAD} element={<KycUpload />} />
                <Route path={ROUTES.TENANT.BANKING} element={<BankingDetails />} />
              </Route>

              <Route element={<TenantGuard requireOnboardingComplete={true} />}>
                <Route path={ROUTES.TENANT.DASHBOARD} element={<TenantDashboardPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRouter;
