import express from "express";
import { registerSeller, loginSeller, registerSellerWithKYC, checkEmailExists } from "../controllers/sellerAuthController.js";
import upload from "../utils/multer.js";

const router = express.Router();


router.post("/check-email", checkEmailExists);


router.post("/register", registerSeller);


router.post("/register-with-kyc", upload.fields([
    // Identity Documents
    { name: 'panCard', maxCount: 1 },
    { name: 'aadhaarFront', maxCount: 1 },
    { name: 'aadhaarBack', maxCount: 1 },
    // Business Documents
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'incorporationCertificate', maxCount: 1 },
    // PESO Licenses
    { name: 'le1Manufacturing', maxCount: 1 },
    { name: 'le2Shop', maxCount: 1 },
    { name: 'le3Storage', maxCount: 1 },
    { name: 'le5Le6SaleTransport', maxCount: 1 },
    // NEERI QR Certification
    { name: 'neeriQRCertificate', maxCount: 1 }
]), registerSellerWithKYC);


router.post("/login", loginSeller);

export default router;
