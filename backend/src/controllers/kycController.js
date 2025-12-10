import KYC from "../models/KYC.js";

export const uploadKYC = async (req, res) => {
  try {
    console.log("=== KYC Upload Started ===");
    const sellerId = req.user._id;
    console.log("Seller ID:", sellerId);

    // Files come from req.files (multer)
    const {
      aadhaarFront,
      aadhaarBack,
      panCard,
      tradeLicense,
      gstCertificate,
      licenseImage,
      fireNOC,
      chequeImage
    } = req.files;

    console.log("Files received:", Object.keys(req.files || {}));

    // Text fields come from req.body
    const {
      licenseType,
      licenseNumber,
      expiryDate,
      fireNOCExpiry,
      bankAccountNumber,
      ifsc
    } = req.body;

    console.log("Text fields received:", {
      licenseType,
      licenseNumber,
      expiryDate,
      fireNOCExpiry,
      bankAccountNumber,
      ifsc
    });

    console.log("Creating KYC record...");
    const kycData = await KYC.create({
      sellerId,
      identity: {
        aadhaarFront: aadhaarFront?.[0]?.path,
        aadhaarBack: aadhaarBack?.[0]?.path,
        panCard: panCard?.[0]?.path,
      },
      business: {
        tradeLicense: tradeLicense?.[0]?.path,
        gstCertificate: gstCertificate?.[0]?.path,
      },
      explosiveLicense: {
        licenseType,
        licenseNumber,
        licenseImage: licenseImage?.[0]?.path,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined
      },
      fireNOC: {
        nocDocument: fireNOC?.[0]?.path,
        expiryDate: fireNOCExpiry ? new Date(fireNOCExpiry) : undefined
      },
      bank: {
        accountNumber: bankAccountNumber,
        ifsc,
        chequeImage: chequeImage?.[0]?.path
      },
      status: "pending_review"
    });

    console.log("KYC record created successfully");

    res.json({
      message: "KYC submitted successfully. Waiting for admin approval.",
      kycData
    });

  } catch (err) {
    console.error("=== KYC Upload Error ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    res.status(500).json({
      message: err.message || "KYC upload failed",
      error: err.name,
      details: err.toString(),
      stack: err.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
    });
  }

};
