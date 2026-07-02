import { Router } from "express";
import { container } from "../../../../infrastructure/container/container";
import { AuthController } from "../../controllers/auth/AuthController";
import { UserProfileController } from "../../controllers/user/UserProfileController";
import { TOKENS } from "../../../../shared/tokens";
import { ROLES } from "../../../../shared/constants/roles";
import { IJwtService } from "../../../../infrastructure/auth/interfaces/IJwtService";
import { createAuthMiddleware } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import upload from "../../middleware/upload";
import { ENDPOINTS } from "../../../../shared/constants/endPoints";

const router = Router();
const authController = container.resolve(AuthController);
const userProfileController = container.resolve(UserProfileController);

const jwtService = container.resolve<IJwtService>(TOKENS.JwtService);
const authenticate = createAuthMiddleware(jwtService);

router.post(ENDPOINTS.USER.AUTH.REGISTER, authController.registerUser);
router.post(ENDPOINTS.USER.AUTH.VERIFY_OTP, authController.verifyUserOtp);
router.post(ENDPOINTS.USER.AUTH.RESEND_OTP, authController.resendUserOtp);
router.post(ENDPOINTS.USER.AUTH.LOGIN,authController.loginUser)

//forgot password
router.post(ENDPOINTS.USER.PASSWORD.SEND_OTP, authController.requestPasswordResetOtp);
router.post(ENDPOINTS.USER.PASSWORD.RESEND_OTP, authController.requestPasswordResetOtp);
router.post(ENDPOINTS.USER.PASSWORD.VERIFY_OTP, authController.verifyPasswordResetOtp);
router.post(ENDPOINTS.USER.PASSWORD.RESET, authController.resetUserPassword);

// user google login
router.post(ENDPOINTS.USER.AUTH.GOOGLE_LOGIN,authController.googleUserLogin)

//profile management
router.get(
  ENDPOINTS.USER.PROFILE.GET,
  authenticate,
  authorize(ROLES.USER),
  userProfileController.getProfile
);

router.patch(
  ENDPOINTS.USER.PROFILE.UPDATE,
  authenticate,
  authorize(ROLES.USER),
  userProfileController.updateProfile
);

router.patch(
  ENDPOINTS.USER.PROFILE.PHOTO,
  authenticate,
  authorize(ROLES.USER),
  upload.single("profilePhoto"),
  userProfileController.updateProfilePhoto
);

router.patch(
  ENDPOINTS.USER.PASSWORD.CHANGE,
  authenticate,
  authorize(ROLES.USER),
  userProfileController.changePassword
);

export default router;
