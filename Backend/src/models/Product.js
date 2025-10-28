// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" }, // e.g. "Caps", "Tickets - Event"
    rating: { type: Number, default: 4.6, min: 0, max: 5 },
    quantity: { type: Number, default: 0, min: 0 },

    // Optional ticket-ish fields (only present for tickets)
    eventName: { type: String, default: "" },
    eventDate: { type: Date },
    venue: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
