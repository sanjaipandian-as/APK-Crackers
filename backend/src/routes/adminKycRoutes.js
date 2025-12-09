import express from "express";
import { authenticate } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { reviewKYC } from "../controllers/adminKycController.js";

const router = express.Router();

// /api/admin/kyc/review/:kycId
router.put("/review/:kycId", authenticate, adminOnly, reviewKYC);

export default router;
