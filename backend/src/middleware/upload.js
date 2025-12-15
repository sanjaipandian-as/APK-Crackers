import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "crackers-app",
    resource_type: "auto", // ⭐ supports images + PDFs
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

// Multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // ⭐ 5MB limit per file
  },
});

export default upload;
