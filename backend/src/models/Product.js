import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // ⭐ Cloudinary image URLs
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one product image is required",
      },
    },

    // ⭐ Admin Approval Flow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },

    // ⭐ Rating System Fields
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// ⭐ TEXT INDEX for FAST SEARCH
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
});

export default mongoose.model("Product", productSchema);
