import ENV from "../config/env";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { endsWithFileExtension } from "../utilities/helpers/helpers";

interface MyParams {
  folder: string;
  allowedFormats?: string[];
  transformation?: { width: number; height: number; crop: string }[];
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME,
  api_key: ENV.API_KEY_4_CLOUDINARY,
  api_secret: ENV.API_SECRET_4_CLOUDINARY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Ryder-Uploads",
    allowedFormats: ["pdf", "jpg", "jpeg", "png", "svg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  } as MyParams,
});

export const upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    // Check file extensions
    if (!endsWithFileExtension(file.originalname)) {
      return cb(new Error("Invalid file extension"));
    }
    cb(null, true);
  },
}).fields([
  { name: "bikeDoc", maxCount: 1 },
  { name: "validIdCard", maxCount: 1 },
  { name: "passportPhoto", maxCount: 1 },
]);
