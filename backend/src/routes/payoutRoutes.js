import express from "express";
import { authenticate } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

import {
  getSellerPayouts,
  getAllPayouts,
  markPayoutPaid
} from "../controllers/payoutController.js";

const router = express.Router();

// Seller routes
router.get("/seller", authenticate, getSellerPayouts);

// Admin routes
router.get("/admin", authenticate, adminOnly, getAllPayouts);
router.put("/admin/pay/:payoutId", authenticate, adminOnly, markPayoutPaid);

export default router;
