// src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routers
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import checkoutRouter from "./routes/checkout.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import mediaRouter from "./routes/media.js";

// Load env
dotenv.config();

const app = express();

/* -------------------- CORS -------------------- */
const STATIC_ALLOWED = [
  "http://localhost:19006",
  "exp://localhost:19000",
  "exp://10.0.2.2:19000",
  "https://slrh.vercel.app",
];

const ENV_ALLOWED = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOWED = Array.from(new Set([...STATIC_ALLOWED, ...ENV_ALLOWED]));

app.use(
  cors({
    origin: ALLOWED,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/* -------------------- Debug endpoints -------------------- */
app.get("/debug/ping", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.get("/debug/env", (_req, res) =>
  res.json({
    PORT: process.env.PORT,
    MONGO_URI: !!process.env.MONGO_URI,
    JWT_SECRET: !!process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  })
);

/* -------------------- API ROUTES -------------------- */
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
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

/* -------------------- Global error handler -------------------- */
app.use((err, _req, res, _next) => {
  console.error("🔥 Uncaught error:", err);
  res
    .status(500)
    .json({ message: err?.message || "Internal server error" });
});

/* -------------------- Mongo connection (cached for Vercel) -------------------- */
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("❌ Missing MONGO_URI in environment");
}

// Cache the connection across invocations on Vercel
let cached = global.__mongoose;
if (!cached) cached = global.__mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, { dbName: "slrh" })
      .then((m) => {
        console.log("✅ MongoDB connected");
        return m;
      })
      .catch((e) => {
        cached.promise = null;
        throw e;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Always connect DB on cold start
await connectDB();

/* -------------------- Export for Vercel & start for local -------------------- */
export default app;

// Only start a port locally. On Vercel, requests are handled by the platform.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 SLRH backend running on port ${PORT}`);
  });
}
