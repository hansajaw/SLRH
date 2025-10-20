import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";

const router = express.Router();

function sign(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/* ---------- SIGNUP (no manual hashing; let pre-save hook hash) ---------- */
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ fullName, email, password }); // <-- no bcrypt.hash here
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

    // Need password to compare -> select("+password")
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

/* ---------- FORGOT PASSWORD ---------- */
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "If the email exists, a reset link was sent." });

    // generate token (not JWT) and expiry
    const raw = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");
    user.resetToken = hashed;
    user.resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save({ validateBeforeSave: false });

    // In production: send email with link containing ?token=<raw>
    // For now, return the token so you can test from the app:
    return res.status(200).json({ message: "Reset link generated", resetToken: raw });
  } catch (err) {
    console.error("Forgot error:", err);
    res.status(500).json({ message: "Server error generating reset link" });
  }
});

/* ---------- RESET PASSWORD ---------- */
router.post("/reset", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and newPassword required" });
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetToken: hashed,
      resetExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword; // pre('save') will hash it
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password updated. Please log in." });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Server error resetting password" });
  }
});

export default router;
