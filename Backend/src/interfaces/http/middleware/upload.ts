import multer from "multer";
import { env } from "../../../config/env";
import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../shared/constants";

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(
        new AppError(
          "Only JPG, PNG and WEBP images are allowed",
          HTTP_STATUS.BAD_REQUEST
        )
      );
    }

    cb(null, true);
  },
});

export default upload;