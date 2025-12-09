import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: "userType" },
  userType: { type: String, enum: ["Customer", "Seller", "Admin"] },

  title: String,
  message: String,
  type: { 
    type: String, 
    enum: ["order", "payment", "kyc", "product", "payout", "system"] 
  },

  isRead: { type: Boolean, default: false }

}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
