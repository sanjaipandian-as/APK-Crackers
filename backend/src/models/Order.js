import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,
  shippingAddress: String,

  status: {
    type: String,
    enum: ["pending_payment", "paid", "packed", "shipped", "delivered", "cancelled"],
    default: "pending_payment"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
