import express from "express";
import Media from "../models/media.js";

const router = express.Router();

// GET all media files
router.get("/", async (req, res) => {
  try {
    const media = await Media.find();
    res.status(200).json({ items: media });
  } catch (err) {
    console.error("❌ Get media error:", err.message, err.stack);
    res.status(500).json({ message: err?.message || "Server error while fetching media." });
  }
});

// POST a new media file (placeholder for upload)
router.post("/upload", async (req, res) => {
  try {
    // In a real application, you would use multer here to handle file uploads
    // and then store the file in a cloud storage (e.g., S3, Cloudinary, Vercel Blob).
    // For now, we'll just create a database entry with a placeholder URL.
    const { url, type, category, title, description, thumbnailUrl, size, width, height } = req.body;

    if (!url || !type) {
      return res.status(400).json({ message: "URL and type are required." });
    }

    const newMedia = await Media.create({
      url,
      type,
      category,
      title,
      description,
      thumbnailUrl,
      size,
      width,
      height,
    });

    res.status(201).json({ message: "Media created successfully.", item: newMedia });
  } catch (err) {
    console.error("❌ Upload media error:", err.message, err.stack);
    res.status(500).json({ message: err?.message || "Server error during media upload." });
  }
});

export default router;