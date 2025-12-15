import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import Seller from "../models/Seller.js";
import Admin from "../models/Admin.js";

export const authenticate = async (req, res, next) => {
  try {
    // 1️⃣ Get token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Find user (Customer / Seller / Admin)
    const user =
      (await Customer.findById(decoded.id)) ||
      (await Seller.findById(decoded.id)) ||
      (await Admin.findById(decoded.id));

    if (!user) {
      return res.status(401).json({ message: "User not found for token" });
    }

    // 4️⃣ Attach user & role
    req.user = user;

    if (user instanceof Seller) {
      req.role = "seller";
    } else if (user instanceof Admin) {
      req.role = "admin";
    } else {
      req.role = "customer";
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
