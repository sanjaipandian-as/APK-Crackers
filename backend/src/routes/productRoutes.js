import express from "express";
import { authenticate } from "../middleware/auth.js";
import { sellerApproved } from "../middleware/sellerApproved.js";
import upload from "../utils/multer.js";
import { addProduct } from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/add",
  authenticate,
  sellerApproved,
  upload.array("images", 5), // max 5 images
  addProduct
);

export default router;
