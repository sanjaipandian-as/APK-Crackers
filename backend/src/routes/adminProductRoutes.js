import express from "express";
import { authenticate } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import {
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getAllProductsCount
} from "../controllers/adminProductController.js";

const router = express.Router();

// Get all pending products
router.get("/pending", authenticate, adminOnly, getPendingProducts);

// Get total products count
router.get("/count", authenticate, adminOnly, getAllProductsCount);

// Approve product
router.put("/approve/:productId", authenticate, adminOnly, approveProduct);

// Reject product
router.put("/reject/:productId", authenticate, adminOnly, rejectProduct);

export default router;
