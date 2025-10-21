import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
    src: { type: String, required: true },     // image URL
    caption: String,
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
