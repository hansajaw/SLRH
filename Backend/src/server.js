import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import checkoutRouter from "./routes/checkout.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import mediaRouter from "./routes/media.js";

dotenv.config();

const app = express();

/* -------------------- CORS -------------------- */
const ALLOWED = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: [
      "http://localhost:19006",
      "exp://localhost:19000",
      "exp://10.0.2.2:19000",
      "https://slrh.vercel.app", 
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/* -------------------- Debug endpoints (temporary) -------------------- */
app.get("/debug/ping", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.get("/debug/env", (_req, res) =>
  res.json({
    PORT: process.env.PORT,
    MONGO_URI: !!process.env.MONGO_URI,
    JWT_SECRET: !!process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  })
);

/* -------------------- ROUTES -------------------- */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/media", mediaRouter);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (_req, res) => res.send("✅ SLRH backend is running"));
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

/* -------------------- 404 -------------------- */
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

/* -------------------- Global error handler -------------------- */
app.use((err, _req, res, _next) => {
  console.error("🔥 Uncaught error:", err);
  res.status(500).json({
    message: err?.message || "Internal server error",
    // stack: err?.stack, // uncomment while debugging
  });
});

/* -------------------- DATABASE CONNECTION -------------------- */
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("❌ Missing MONGO_URI in environment");

mongoose
  .connect(MONGO_URI, { dbName: "slrh" })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 SLRH backend running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
