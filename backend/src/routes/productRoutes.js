import express from "express";
import { authenticate } from "../middleware/auth.js";
import { sellerGuard } from "../middleware/sellerGuard.js";
import upload from "../middleware/upload.js";

import {
  addProduct,
  getSellerProducts
} from "../controllers/productController.js";

const router = express.Router();

/**
 * 🔐 SELLER — GET OWN PRODUCTS
 */
router.get(
  "/my-products",
  authenticate,
  sellerGuard,
  getSellerProducts
);

/**
 * 🔐 SELLER — ADD PRODUCT (KYC APPROVED ONLY)
 */
router.post(
  "/add",
  authenticate,
  sellerGuard,
  upload.array("images", 5),
  addProduct
);

export default router;
