import KYC from "../models/KYC.js";
import Seller from "../models/Seller.js";
import { sendNotification } from "../utils/sendNotification.js"; // ⭐ IMPORTANT


export const reviewKYC = async (req, res) => {
  try {
    const { kycId } = req.params;
    const { status, rejectionReason } = req.body;

    // Fetch KYC record
    const kyc = await KYC.findById(kycId);
    if (!kyc) return res.status(404).json({ message: "KYC not found" });

    // Update KYC status
    kyc.status = status;

    if (status === "rejected") {
      kyc.rejectionReason = rejectionReason;
    }

    await kyc.save();

    // Update seller KYC status also
    const seller = await Seller.findById(kyc.sellerId);
    seller.kycStatus = status;
    await seller.save();


    // ⭐ SEND NOTIFICATION — APPROVED
    if (status === "approved") {
      await sendNotification(
        kyc.sellerId,
        "Seller",
        "KYC Approved",
        "Your KYC has been successfully approved.",
        "kyc"
      );
    }

    // ⭐ SEND NOTIFICATION — REJECTED
    if (status === "rejected") {
      await sendNotification(
        kyc.sellerId,
        "Seller",
        "KYC Rejected",
        "Your KYC was rejected. Check the reason and resubmit.",
        "kyc"
      );
    }


    res.json({
      message: `KYC ${status}`,
      kyc,
      seller
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
