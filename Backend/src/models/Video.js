import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: String,
    youtubeId: { type: String, required: true }, // e.g. "dQw4w9WgXcQ"
    thumbnail: String,                            // absolute URL to image
    duration: String,                             // optional "4:25"
    publishedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
