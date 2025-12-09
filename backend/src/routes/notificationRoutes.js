import express from "express";
import { authenticate } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get notifications for logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      userType: req.userRole
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.put("/:id/read", authenticate, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
