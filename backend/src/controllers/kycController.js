import KYC from "../models/KYC.js";

export const uploadKYC = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const {
      aadhaarFront,
      aadhaarBack,
      panCard,
      tradeLicense,
      gstCertificate,
      licenseType,
      licenseNumber,
      licenseImage,
      fireNOC,
      bankAccountNumber,
      ifsc,
      chequeImage
    } = req.files;

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
      },
      fireNOC: {
        nocDocument: fireNOC?.[0]?.path,
      },
      bank: {
        accountNumber: bankAccountNumber,
        ifsc,
        chequeImage: chequeImage?.[0]?.path
      },
      status: "pending_review"
    });

    res.json({
      message: "KYC submitted successfully. Waiting for admin approval.",
      kycData
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
