import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/users.js";
import productRoutes from "./src/routes/products.js";
import eventRoutes from "./src/routes/events.js";
import mediaRoutes from "./src/routes/media.js";
import liveRoutes from "./src/routes/live.js";
import cartRoutes from "./src/routes/cart.js";
import checkoutRoutes from "./src/routes/checkout.js";

dotenv.config();

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "slrh" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/live", liveRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/checkout", checkoutRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ status: "Backend API is running!" });
});

// ✅ Export app (for Vercel)
export default app;

// ✅ Start server locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
