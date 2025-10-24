import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

function signToken(id) {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not set");
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    console.log("📝 Signup request:", { email });

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const newUser = await User.create({ email, password });
    console.log("✅ Created user:", { id: newUser._id, email: newUser.email });

    const token = signToken(newUser._id);
    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: { _id: newUser._id, email: newUser.email },
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message, err.stack);
    res.status(500).json({ message: err?.message || "Server error during signup." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📝 Login request:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);
    user.password = undefined;
    console.log("✅ Login successful:", { id: user._id, email: user.email });

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("❌ Login error:", err.message, err.stack);
    res.status(500).json({ message: err?.message || "Server error during login." });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📝 Forgot password request:", { email });

    if (!email) {
      return res.status(400).json({ message: "Email required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email." });
    }

    // Mock reset (update with actual reset logic if needed)
    console.log("✅ Mock reset token generated for:", { email });
    res.status(200).json({ message: "Password reset link (mock) sent." });
  } catch (err) {
    console.error("❌ Forgot error:", err.message, err.stack);
    res.status(500).json({ message: err?.message || "Server error during password reset." });
  }
});

export default router;