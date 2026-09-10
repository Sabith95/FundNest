import multer from "multer";
import { env } from "../../../infrastructure/config/env";

import { BadRequestError } from "../../../shared/errors/BadRequestError";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(
        new BadRequestError("Only JPG, PNG and WEBP images are allowed"),
      );
    }

    cb(null, true);
  },
});

export default upload;
