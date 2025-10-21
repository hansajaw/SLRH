import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cover: { type: String, required: true }, // album cover image URL
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);
