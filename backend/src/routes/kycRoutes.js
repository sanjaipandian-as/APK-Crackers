import express from "express";
import upload from "../utils/multer.js";
import { uploadKYC } from "../controllers/kycController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  upload.fields([
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "tradeLicense", maxCount: 1 },
    { name: "gstCertificate", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
    { name: "fireNOC", maxCount: 1 },
    { name: "chequeImage", maxCount: 1 },
  ]),
  uploadKYC
);

export default router;
    