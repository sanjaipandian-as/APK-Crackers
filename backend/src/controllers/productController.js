import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const { name, description, price, category, stock } = req.body;

    // Uploaded images from Cloudinary
    const images = req.files.map(file => file.path);

    const product = await Product.create({
      sellerId,
      name,
      description,
      price,
      category,
      stock,
      images,
      status: "pending" // Admin will approve
    });

    res.json({
      message: "Product submitted for admin approval",
      product
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
