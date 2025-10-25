import fs from "fs-extra";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Media from "../models/media.js";
import { connectDB } from "../db.js";

dotenv.config();

const ASSETS_PATH = "C:\\Users\\ASUS\\Desktop\\SLRH Mobile App\\SLRH\\assets"; // Frontend assets path
const BASE_MEDIA_URL = "https://your-cdn.com/assets"; // Placeholder for your CDN or hosted assets

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

const getMediaType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if ([ ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" ].includes(ext)) {
    return "image";
  }
  if ([ ".mp4", ".mov", ".avi", ".mkv" ].includes(ext)) {
    return "video";
  }
  return null;
};

const seedMedia = async () => {
  await connectDB();
  console.log("Connected to MongoDB for media seeding.");

  try {
    await Media.deleteMany({});
    console.log("Cleared existing media entries.");

    const files = await fs.readdir(ASSETS_PATH, { recursive: true });
    const mediaEntries = [];

    for (const file of files) {
      const filePath = path.join(ASSETS_PATH, file);
      const stat = await fs.stat(filePath);

      if (stat.isFile()) {
        const mediaType = getMediaType(filePath);
        if (mediaType) {
          const relativePath = path.relative(ASSETS_PATH, filePath).replace(/\\/g, "/");
          const url = `${BASE_MEDIA_URL}/${relativePath}`;
          const category = relativePath.split("/")[0]; // Use top-level folder as category

          mediaEntries.push({
            url,
            type: mediaType,
            category,
            title: path.basename(file),
            size: stat.size,
            // Add more metadata if available, e.g., dimensions (requires image processing lib)
          });
        }
      }
    }

    await Media.insertMany(mediaEntries);
    console.log(`✅ Successfully seeded ${mediaEntries.length} media files.`);
  } catch (error) {
    console.error("❌ Error seeding media:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedMedia();
