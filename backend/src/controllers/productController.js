import Product from "../models/Product.js";

// ==============================
// ⭐ ADD PRODUCT (SELLER ONLY)
// ==============================
export const addProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const { name, description, price, category, stock } = req.body;

    // 🔒 Basic validation
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than zero",
      });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    // ⭐ Cloudinary image URLs
    const imageUrls = req.files?.map((file) => file.path) || [];

    if (imageUrls.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }

    const product = await Product.create({
      sellerId,
      name: name.trim(),
      description: description?.trim(),
      price,
      category,
      stock: stock ?? 0,
      images: imageUrls,
      status: "pending", // 🔒 Admin approval required
    });

    return res.status(201).json({
      message: "Product submitted for admin approval",
      product,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to add product",
      error: err.message,
    });
  }
};

// ==============================
// ⭐ GET SELLER PRODUCTS
// ==============================
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({ sellerId })
      .sort({ createdAt: -1 });

    return res.json({
      count: products.length,
      products,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};
