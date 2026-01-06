import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      unique: true, // ⭐ one KYC per seller
      index: true,
    },

    // Identity Documents
    identity: {
      panCard: {
        type: String,
        trim: true,
        required: true,
      },
      aadhaarFront: {
        type: String,
        trim: true,
        required: true,
      },
      aadhaarBack: {
        type: String,
        trim: true,
        required: true,
      },
    },

    // Business Documents
    business: {
      gstCertificate: {
        type: String,
        trim: true,
        required: true,
      },
      gstNumber: {
        type: String,
        trim: true,
        required: true,
      },
      incorporationCertificate: {
        type: String,
        trim: true,
      },
      cinOrLlpin: {
        type: String,
        trim: true,
      },
    },

    // PESO Licenses (Petroleum and Explosives Safety Organisation)
    pesoLicenses: {
      // LE-1: Manufacturing License
      le1Manufacturing: {
        document: {
          type: String,
          trim: true,
        },
        licenseNumber: {
          type: String,
          trim: true,
        },
        expiryDate: {
          type: Date,
        },
      },
      // LE-2: Shop License
      le2Shop: {
        document: {
          type: String,
          trim: true,
        },
        licenseNumber: {
          type: String,
          trim: true,
        },
        expiryDate: {
          type: Date,
        },
      },
      // LE-3: Storage License
      le3Storage: {
        document: {
          type: String,
          trim: true,
        },
        licenseNumber: {
          type: String,
          trim: true,
        },
        expiryDate: {
          type: Date,
        },
      },
      // LE-5/LE-6: Sale/Transport License
      le5Le6SaleTransport: {
        document: {
          type: String,
          trim: true,
        },
        licenseNumber: {
          type: String,
          trim: true,
        },
        expiryDate: {
          type: Date,
        },
      },
    },

    // NEERI QR Certification (National Environmental Engineering Research Institute)
    neeriQR: {
      certificate: {
        type: String,
        trim: true,
      },
      certificationNumber: {
        type: String,
        trim: true,
      },
      expiryDate: {
        type: Date,
      },
    },

    status: {
      type: String,
      enum: [
        "not_submitted",
        "pending_review",
        "approved",
        "rejected",
        "license_expired",
      ],
      default: "not_submitted",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("KYC", kycSchema);
