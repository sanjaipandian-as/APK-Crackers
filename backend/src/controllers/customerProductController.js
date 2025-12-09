import Product from "../models/Product.js";

// 1. Get all approved products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      status: "approved"
    }).populate("sellerId");

    if (!product)
      return res.status(404).json({ message: "Product not found or not approved" });

    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Search products
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    const products = await Product.find({
      status: "approved",
      name: { $regex: q, $options: "i" }
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Filter by category
export const filterByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      status: "approved",
      category
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Pagination
export const getPaginatedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ status: "approved" })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ status: "approved" });

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      products
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
