import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    category: { type: String }, // e.g., 'racing', 'drivers', 'events', 'store'
    title: { type: String },
    description: { type: String },
    thumbnailUrl: { type: String }, // For videos
    uploadedAt: { type: Date, default: Date.now },
    size: { type: Number }, // in bytes
    width: { type: Number },
    height: { type: Number },
    // You can add more fields as needed, e.g., uploader, tags, etc.
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);
export default Media;