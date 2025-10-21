import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import checkoutRouter from "./routes/checkout.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import mediaRouter from "./routes/media.js";


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST", "PATCH"] } });

const ALLOWED = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // RN/Emulator often sends no origin
    if (ALLOWED.length === 0 || ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for: ${origin}`), false);
  },
  credentials: true,
}));
app.use(express.json());

// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/media", mediaRouter);


app.get("/", (_req, res) => res.send("✅ SLRH backend is running"));
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

["MONGO_URI", "PORT", "JWT_SECRET"].forEach((k) => {
  if (!process.env[k]) { console.error(`❌ Missing ${k} in .env`); process.exit(1); }
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "slrh" });
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Backend live on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Mongo connection failed:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

start();
