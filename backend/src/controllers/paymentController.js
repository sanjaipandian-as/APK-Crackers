import { razorpayInstance } from "../config/razorpay.js";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import { sendNotification } from "../utils/sendNotification.js";  // ⭐ IMPORTANT
import crypto from "crypto";


// STEP 4 — Create Razorpay Payment Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const options = {
      amount: order.totalAmount * 100,   // convert to paise
      currency: "INR",
      receipt: `receipt_${order._id}`,
    };

    const paymentOrder = await razorpayInstance.orders.create(options);

    res.json({
      message: "Payment order created",
      paymentOrder,
      razorpayKey: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// STEP 5 — Verify Payment & Auto-Create Payout
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Fetch order from DB
    const order = await Order.findById(orderId);

    // Update payment success
    order.paymentStatus = "success";
    order.status = "paid";
    await order.save();


    // ⭐ SEND PAYMENT SUCCESS NOTIFICATION TO CUSTOMER
    await sendNotification(
      order.customerId,
      "Customer",
      "Payment Successful",
      "Your payment has been verified.",
      "payment"
    );


    // ⭐ AUTO CREATE PAYOUT ENTRY FOR SELLER
    const commissionRate = 0.10; // Platform earns 10%
    const commission = order.totalAmount * commissionRate;
    const netAmount = order.totalAmount - commission;

    const settlementDate = new Date();
    settlementDate.setDate(settlementDate.getDate() + 7); // T+7 cycle

    await Payout.create({
      sellerId: order.sellerId,
      orderId: order._id,
      totalAmount: order.totalAmount,
      commission,
      netAmount,
      settlementDate,
      status: "pending"
    });


    res.json({
      message: "Payment verified successfully",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// STEP 6 — Payment Failed
export const paymentFailed = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    order.paymentStatus = "failed";
    order.status = "pending_payment";
    await order.save();

    res.json({ message: "Payment failed", order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
