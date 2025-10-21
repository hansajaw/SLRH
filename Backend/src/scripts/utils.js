import "dotenv/config";
import mongoose from "mongoose";

export async function connect() {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error("❌ MONGO_URI missing in .env"); process.exit(1); }
  await mongoose.connect(uri, { dbName: "slrh" });
  console.log("✅ Connected to MongoDB");
}

export async function done(code = 0) {
  await mongoose.connection.close().catch(() => {});
  process.exit(code);
}
