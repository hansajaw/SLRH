import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// routes
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import checkoutRouter from "./routes/checkout.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import mediaRouter from "./routes/media.js";

import { connectDB } from "./db.js";

dotenv.config();

const app = express();

/* ------------ Env sanity ------------ */
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined");
  // in Vercel we shouldn’t exit synchronously; let request return 500 instead.
}
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
}

/* ------------ CORS ------------ */
const ALLOWED_ORIGINS = [
  "http://localhost:19006",
  "http://10.0.2.2:19006",
  "exp://localhost:19000",
  "exp://10.0.2.2:19000",
  "https://slrh.vercel.app",
];
if (process.env.CORS_ORIGIN) {
  ALLOWED_ORIGINS.push(
    ...process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  );
}
app.use(
  cors({
    origin: (origin, cb) => {
      // Native apps have `origin === null`
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      console.warn("🚫 Blocked by CORS:", origin);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/* ------------ DB connect once on cold start ------------ */
await connectDB();

/* ------------ Routes ------------ */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/media", mediaRouter);

/* ------------ Health & debug ------------ */
app.get("/", (_req, res) => res.send("✅ SLRH Backend API is running 🚀"));
app.get("/debug/ping", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.get("/debug/db", async (_req, res) => {
  try {
    const conn = await connectDB();
    const state = conn.connection.readyState; // 1 = connected
    res.json({ connected: state === 1, state });
  } catch (e) {
    res.status(500).json({ connected: false, error: e?.message });
  }
});

/* ------------ 404 & errors ------------ */
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});
app.use((err, _req, res, _next) => {
  console.error("🔥 Uncaught error:", err?.message);
  res.status(500).json({ message: err?.message || "Internal server error" });
});

/* ------------ Local only: start server ------------ */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 SLRH backend running on http://localhost:${PORT}`);
  });
}

export default app;
