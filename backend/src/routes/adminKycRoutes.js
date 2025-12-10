import express from "express";
import { authenticate } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { reviewKYC, getPendingKYCs } from "../controllers/adminKycController.js";

const router = express.Router();

// /api/admin/kyc/review/:kycId
router.put("/review/:kycId", authenticate, adminOnly, reviewKYC);

// /api/admin/kyc/pending
router.get("/pending", authenticate, adminOnly, getPendingKYCs);

export default router;
