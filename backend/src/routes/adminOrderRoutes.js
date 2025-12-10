import express from "express";
import { authenticate } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import {
  getAllOrders,
  getOrdersByStatus,
  adminUpdateOrderStatus,
  cancelOrder
} from "../controllers/adminOrderController.js";

const router = express.Router();

router.get("/", authenticate, adminOnly, getAllOrders);
router.get("/:status", authenticate, adminOnly, getOrdersByStatus);
router.put("/update/:orderId", authenticate, adminOnly, adminUpdateOrderStatus);
router.put("/cancel/:orderId", authenticate, adminOnly, cancelOrder);

export default router;