import express from "express";
import { authenticate } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { 
  getAdminDashboard,
  getDailySales
} from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.get("/dashboard", authenticate, adminOnly, getAdminDashboard);
router.get("/sales/daily", authenticate, adminOnly, getDailySales);

export default router;
