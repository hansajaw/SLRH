import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";

const router = express.Router();

// ✅ Generate JWT
function sign(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/* ---------- SIGNUP ---------- */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "Missing required fields" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ email, password });
    const token = sign(user);

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

/* ---------- LOGIN ---------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = sign(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
