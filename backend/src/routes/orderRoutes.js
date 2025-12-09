import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

// Checkout
router.post("/create", authenticate, createOrder);

export default router;
