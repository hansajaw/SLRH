import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: String,
    body: String,
    banner: String,          // image URL
    category: String,
    publishedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);
