import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// GET current user
router.get("/me", protect, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error("Get /me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH update profile
router.patch("/me", protect, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json({ user: updated });
  } catch (err) {
    console.error("Update /me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST change password
router.post("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Old password incorrect" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
