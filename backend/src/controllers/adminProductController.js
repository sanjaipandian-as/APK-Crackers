import Product from "../models/Product.js";
import { sendNotification } from "../utils/sendNotification.js";   // ⭐ IMPORTANT


// ⭐ GET ALL PENDING PRODUCTS FOR ADMIN REVIEW
export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" }).populate("sellerId");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ⭐ APPROVE PRODUCT
export const approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = "approved";
    await product.save();


    // ⭐ SEND NOTIFICATION TO SELLER — PRODUCT APPROVED
    await sendNotification(
      product.sellerId,
      "Seller",
      "Product Approved",
      `${product.name} has been approved.`,
      "product"
    );


    res.json({ message: "Product approved successfully", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ⭐ REJECT PRODUCT
export const rejectProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = "rejected";
    product.rejectionReason = reason || "Not specified";
    await product.save();


    // ⭐ SEND NOTIFICATION TO SELLER — PRODUCT REJECTED
    await sendNotification(
      product.sellerId,
      "Seller",
      "Product Rejected",
      `Your product "${product.name}" was rejected.`,
      "product"
    );


    res.json({ message: "Product rejected", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
