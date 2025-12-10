import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
