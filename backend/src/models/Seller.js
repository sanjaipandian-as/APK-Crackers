import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // ⭐ security
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      enum: ["manufacturer", "wholesaler", "retailer"],
      required: true,
    },

    businessAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // ⭐ KYC status (USED BY sellerGuard.js)
    kycStatus: {
      type: String,
      enum: [
        "not_submitted",
        "pending_review",
        "approved",
        "rejected",
        "license_expired",
      ],
      default: "not_submitted",
    },

    // ⭐ Seller account status (USED BY sellerGuard.js)
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);
