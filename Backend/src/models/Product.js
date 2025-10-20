import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    category: String,
    quantity: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
