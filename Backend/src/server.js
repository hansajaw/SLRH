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

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in environment");
  process.exit(1);
}
console.log("✅ Environment variables loaded:", {
  MONGO_URI: process.env.MONGO_URI.substring(0, 30) + "...",
  JWT_SECRET: process.env.JWT_SECRET.substring(0, 10) + "...",
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT || 3001,
});

const ALLOWED_ORIGINS = [
  "http://localhost:19006",
  "http://10.0.2.2:19006",
  "exp://localhost:19000",
  "exp://10.0.2.2:19000",
  "https://slrh.vercel.app",
];
if (process.env.CORS_ORIGIN) {
  const extra = process.env.CORS_ORIGIN.split(",").map((s) => s.trim());
  ALLOWED_ORIGINS.push(...extra);
}
app.use(
  cors({
    origin: (origin, cb) => {
      console.log("🔎 CORS check for origin:", origin);
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      console.warn("🚫 Blocked by CORS:", origin);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

console.log("✅ Mounting routes...");
console.log("🔗 Auth routes:", authRouter.stack.map(r => `${r.route.path} (${r.route.stack[0].method})`));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/media", mediaRouter);

app.get("/debug/ping", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.get("/", (_req, res) => res.send("✅ SLRH Backend API is running 🚀"));
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

app.use((req, res) => {
  console.warn(`🚫 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Routeeee not found: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Uncaught error:", err.message, err.stack);
  res.status(500).json({ message: err?.message || "Internal server error" });
});

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "slrh",
    serverSelectionTimeoutMS: 15000, // ⏰ 15s
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 SLRH backend running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/healthz`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message, err.stack);
    process.exit(1);
  });

export default app;