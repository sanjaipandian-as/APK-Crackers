import Seller from "../models/Seller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ⭐ Token generator function
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" } // Token expires in 24 hours
  );
};

// ==============================
// ⭐ CHECK EMAIL OR PHONE EXISTS
// ==============================
export const checkEmailExists = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    let exists = null;
    let message = "";

    if (email) {
      exists = await Seller.findOne({ email });
      message = exists ? "Email already registered" : "Email available";
    } else if (phone) {
      exists = await Seller.findOne({ phone });
      message = exists ? "Phone number already registered" : "Phone number available";
    }

    res.json({
      exists: !!exists,
      message
    });

  } catch (err) {
    console.error("❌ Email/Phone check error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// ⭐ REGISTER SELLER
// ==============================
export const registerSeller = async (req, res) => {
  try {
    console.log("📝 Registration request received:", req.body);

    const {
      name,
      email,
      phone,
      password,
      businessName,
      businessType,
      businessAddress
    } = req.body;

    const { pincode, state, city, addressLine } = businessAddress || {};

    // ✅ Validation
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !businessName ||
      !businessType ||
      !businessAddress ||
      !pincode ||
      !state ||
      !city ||
      !addressLine
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if seller already exists
    const exists = await Seller.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "Seller with this email already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      name,
      email,
      phone,
      password: hashed,
      businessName,
      businessType,
      businessAddress,
      kycStatus: "not_submitted",
      status: "active",
    });

    const token = generateToken(seller._id);

    res.status(201).json({
      message: "Seller registered successfully",
      token,
      seller,
    });

  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// ⭐ LOGIN SELLER
// ==============================
export const loginSeller = async (req, res) => {
  try {
    console.log("🔐 Login request received:", { email: req.body.email });

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const seller = await Seller.findOne({ email }).select("+password");
    if (!seller) {
      console.log("❌ Seller not found:", email);
      return res.status(404).json({ message: "Seller not found" });
    }

    console.log("✅ Seller found:", seller.email, "Status:", seller.status);

    if (seller.status === "blocked") {
      console.log("❌ Seller is blocked:", email);
      return res.status(403).json({
        message: "Your account has been blocked by admin. Contact support."
      });
    }

    const match = await bcrypt.compare(password, seller.password);
    if (!match) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(seller._id);

    seller.password = undefined;

    console.log("✅ Login successful for:", seller.email);

    res.json({
      message: "Login successful",
      token,
      seller
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// ⭐ REGISTER SELLER WITH KYC
// ==============================
export const registerSellerWithKYC = async (req, res) => {
  try {
    console.log("📝 Combined registration request received");

    const {
      name,
      email,
      phone,
      password,
      businessName,
      businessType,
      businessAddress,
      city,
      state,
      pincode,
      // KYC text fields
      gstNumber,
      cinOrLlpin,
      // PESO LE-1 Manufacturing
      le1LicenseNumber,
      le1ExpiryDate,
      // PESO LE-2 Shop
      le2LicenseNumber,
      le2ExpiryDate,
      // PESO LE-3 Storage
      le3LicenseNumber,
      le3ExpiryDate,
      // PESO LE-5/LE-6 Sale/Transport
      le5Le6LicenseNumber,
      le5Le6ExpiryDate,
      // NEERI QR
      neeriQRNumber,
      neeriQRExpiry
    } = req.body;

    // ✅ Validation for registration fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !businessName ||
      !businessType ||
      !businessAddress ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "All registration fields are required",
      });
    }

    // Check if seller already exists
    const exists = await Seller.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "Seller with this email already exists"
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create seller
    const seller = await Seller.create({
      name,
      email,
      phone,
      password: hashed,
      businessName,
      businessType,
      businessAddress: {
        addressLine: businessAddress,
        city,
        state,
        pincode
      },
      kycStatus: "pending_review", // Set to pending since KYC is being submitted
      status: "active",
    });

    // Handle KYC document uploads
    const KYC = (await import("../models/KYC.js")).default;

    const kycData = {
      sellerId: seller._id,
      identity: {
        panCard: req.files?.panCard?.[0]?.path || '',
        aadhaarFront: req.files?.aadhaarFront?.[0]?.path || '',
        aadhaarBack: req.files?.aadhaarBack?.[0]?.path || '',
      },
      business: {
        gstCertificate: req.files?.gstCertificate?.[0]?.path || '',
        gstNumber: gstNumber || '',
        incorporationCertificate: req.files?.incorporationCertificate?.[0]?.path || '',
        cinOrLlpin: cinOrLlpin || '',
      },
      pesoLicenses: {
        le1Manufacturing: {
          document: req.files?.le1Manufacturing?.[0]?.path || '',
          licenseNumber: le1LicenseNumber || '',
          expiryDate: le1ExpiryDate || null,
        },
        le2Shop: {
          document: req.files?.le2Shop?.[0]?.path || '',
          licenseNumber: le2LicenseNumber || '',
          expiryDate: le2ExpiryDate || null,
        },
        le3Storage: {
          document: req.files?.le3Storage?.[0]?.path || '',
          licenseNumber: le3LicenseNumber || '',
          expiryDate: le3ExpiryDate || null,
        },
        le5Le6SaleTransport: {
          document: req.files?.le5Le6SaleTransport?.[0]?.path || '',
          licenseNumber: le5Le6LicenseNumber || '',
          expiryDate: le5Le6ExpiryDate || null,
        },
      },
      neeriQR: {
        certificate: req.files?.neeriQRCertificate?.[0]?.path || '',
        certificationNumber: neeriQRNumber || '',
        expiryDate: neeriQRExpiry || null,
      },
      status: "pending_review",
    };

    await KYC.create(kycData);

    const token = generateToken(seller._id);

    res.status(201).json({
      message: "Seller registered successfully with KYC. Your documents are under review.",
      token,
      seller,
    });

  } catch (err) {
    console.error("❌ Combined registration error:", err);
    console.error("Error stack:", err.stack);
    console.error("Request body:", req.body);
    console.error("Request files:", Object.keys(req.files || {}));
    res.status(500).json({ error: err.message, details: err.stack });
  }
};

