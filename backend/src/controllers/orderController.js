import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { sendNotification } from "../utils/sendNotification.js";  // ⭐ IMPORTANT


export const createOrder = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { shippingAddress } = req.body;

    // Fetch customer cart
    const cart = await Cart.findOne({ customerId }).populate("items.productId");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    // Calculate total price
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Firecrackers come from ONE seller → get sellerId from product
    const sellerId = cart.items[0].productId.sellerId;

    // Deduct stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock for a product" });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      customerId,
      sellerId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "pending_payment",
      paymentStatus: "pending"
    });


    // ⭐⭐ ADD NOTIFICATION HERE — RIGHT AFTER ORDER IS CREATED ⭐⭐
    await sendNotification(
      sellerId,
      "Seller",
      "New Order Received",
      "A new order has been placed for your products.",
      "order"
    );


    // Clear customer cart
    await Cart.findOneAndUpdate(
      { customerId },
      { $set: { items: [] } }
    );

    res.json({
      message: "Order created successfully. Proceed to payment.",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
