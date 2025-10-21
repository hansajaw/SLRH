// src/models/media.js
import mongoose from "mongoose";

const opts = { timestamps: true };

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: String,
    youtubeId: { type: String, required: true }, // e.g. "dQw4w9WgXcQ"
    thumbnail: String, // URL
  },
  opts
);

const AlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cover: String, // URL
  },
  opts
);

const MediaImageSchema = new mongoose.Schema(
  {
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
    src: { type: String, required: true }, // URL
    caption: String,
  },
  opts
);

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: String,
    body: String,
    banner: String, // URL
    publishedAt: { type: Date, default: Date.now },
  },
  opts
);

export const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);
export const Album = mongoose.models.Album || mongoose.model("Album", AlbumSchema);
export const MediaImage = mongoose.models.MediaImage || mongoose.model("MediaImage", MediaImageSchema);
export const News = mongoose.models.News || mongoose.model("News", NewsSchema);
