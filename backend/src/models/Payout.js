import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

  totalAmount: Number,     // total order amount
  commission: Number,      // platform fee
  netAmount: Number,       // seller gets this

  status: {
    type: String,
    enum: ["pending", "processing", "paid"],
    default: "pending"
  },

  settlementDate: Date     // T+7 date
}, { timestamps: true });

export default mongoose.model("Payout", payoutSchema);
