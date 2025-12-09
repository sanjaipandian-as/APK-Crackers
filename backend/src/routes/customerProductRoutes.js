import express from "express";
import {
  getAllProducts,
  getProductById,
  searchProducts,
  filterByCategory,
  getPaginatedProducts
} from "../controllers/customerProductController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/product/:productId", getProductById);
router.get("/search", searchProducts);
router.get("/category/:category", filterByCategory);
router.get("/page", getPaginatedProducts);

export default router;
