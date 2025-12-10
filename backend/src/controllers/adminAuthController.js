// src/controllers/adminAuthController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const existsUsername = await Admin.findOne({ username });
    if (existsUsername) return res.status(400).json({ message: "Username already exists" });

    if (email) {
      const existsEmail = await Admin.findOne({ email });
      if (existsEmail) return res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      email,
      password: hashed
    });

    const token = generateToken(admin._id, "admin");

    const adminObj = admin.toObject();
    delete adminObj.password;

    res.status(201).json({ message: "Admin registered successfully", token, admin: adminObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id, "admin");

    const adminObj = admin.toObject();
    delete adminObj.password;

    res.json({ message: "Admin login successful", token, admin: adminObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
