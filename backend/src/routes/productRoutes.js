import express from "express";
import { authenticate } from "../middleware/auth.js";
import { sellerApproved } from "../middleware/sellerApproved.js";
import upload from "../utils/multer.js";
import { addProduct, getSellerProducts } from "../controllers/productController.js";

const router = express.Router();

// Get all products for the authenticated seller
router.get("/my-products", authenticate, getSellerProducts);
console.log('✅ GET /my-products route registered');

// Add new product
router.post(
  "/add",
  authenticate,
  sellerApproved,
  upload.array("images", 5), // max 5 images
  addProduct
);
console.log('✅ POST /add route registered');

export default router;
