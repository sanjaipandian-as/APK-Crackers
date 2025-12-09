import express from "express";
import { authenticate } from "../middleware/auth.js";
import { 
  getSellerOrders, 
  updateOrderStatus 
} from "../controllers/sellerOrderController.js";

const router = express.Router();

// Get all orders for this seller
router.get("/", authenticate, getSellerOrders);

// Update order status
router.put("/:orderId", authenticate, updateOrderStatus);

export default router;
