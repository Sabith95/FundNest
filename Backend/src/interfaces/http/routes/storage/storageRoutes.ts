import { Router } from "express";
import { container } from "../../../../infrastructure/container/container";
import { StorageController } from "../../controllers/storage/StorageController";
import { createAuthMiddleware } from "../../middleware/authenticate";
import { TOKENS } from "../../../../shared/tokens";
import { JwtService } from "../../../../infrastructure/auth/JwtService";
import { authorize } from "../../middleware/authorize";
import { ROLES } from "../../../../shared/constants/roles";

const router = Router();
const jwtService = container.resolve(TOKENS.JwtService) as JwtService;
const authenticate = createAuthMiddleware(jwtService);
const storageController = container.resolve(StorageController);

router.post(
  "/presigned-url",
  authenticate,
  authorize(ROLES.TENANT_ADMIN),
  storageController.generateUploadUrl,
);

router.post(
  "/presigned-download-url",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.TENANT_ADMIN),
  storageController.generateDownloadUrl,
);

export default router;
