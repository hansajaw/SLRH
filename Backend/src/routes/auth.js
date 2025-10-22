const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/* -------------------- SIGNUP -------------------- */
router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const newUser = await User.create({ email, password });

    res.status(201).json({
      message: "Account created successfully.",
      user: { _id: newUser._id, email: newUser.email },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
});

/* -------------------- LOGIN -------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    user.password = undefined; // remove password before sending

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

/* -------------------- FORGOT PASSWORD (Optional) -------------------- */
router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Please provide an email." });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ message: "No account found with that email address." });

  // In a real app, generate a reset token and email it
  res.status(200).json({
    message: "Password reset link (mock) sent successfully.",
  });
});

module.exports = router;
