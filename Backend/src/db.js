// src/db.js
import mongoose from "mongoose";

let cached = globalThis.__mongoose;
if (!cached) {
  cached = globalThis.__mongoose = { conn: null, promise: null };
}

// optional: cut noisy deprecations
mongoose.set("strictQuery", true);
// important: fail fast instead of buffering queries while disconnected
mongoose.set("bufferCommands", false);

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set");

    cached.promise = mongoose
      .connect(uri, {
        dbName: "slrh",
        serverSelectionTimeoutMS: 15000,   // 15s to pick a server
        socketTimeoutMS: 30000,
        maxPoolSize: 5,                    // small pool for serverless
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected");
        return mongooseInstance;
      })
      .catch((err) => {
        // ensure next request tries again
        cached.promise = null;
        console.error("❌ MongoDB connect failed:", err?.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
