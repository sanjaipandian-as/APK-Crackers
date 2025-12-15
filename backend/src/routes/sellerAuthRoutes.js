import express from "express";
import { registerSeller, loginSeller } from "../controllers/sellerAuthController.js";

const router = express.Router();

// ⭐ Seller Signup
router.post("/signup", registerSeller);

// ⭐ Seller Login
router.post("/login", loginSeller);

export default router;
