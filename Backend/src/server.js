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

// --- CORS ---
const ALLOWED = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (ALLOWED.length === 0 || ALLOWED.includes(origin))
        return cb(null, true);
      return cb(new Error(`CORS blocked for: ${origin}`), false);
    },
    credentials: true,
  })
);

app.use(express.json());

// --- ROUTES ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/media", mediaRouter);

// --- Health Check ---
app.get("/", (_req, res) => res.send("✅ SLRH backend is running"));
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("❌ Missing MONGO_URI in environment");

mongoose
  .connect(MONGO_URI, { dbName: "slrh" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Export Express app instead of starting a server
export default app;
