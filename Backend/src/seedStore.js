import 'dotenv/config.js';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/slrh';

const items = [
  {
    title: 'SLRH Team Tee',
    price: 4500,
    category: 'Tees',
    description: 'Official cotton tee for team fans.',
    image: 'https://picsum.photos/seed/tee/800/600',
    quantity: 10,
    rating: 4.6,
  },
  {
    title: 'SLRH Cap',
    price: 3500,
    category: 'Caps',
    description: 'Premium cotton racing cap.',
    image: 'https://picsum.photos/seed/cap/800/600',
    quantity: 3,
    rating: 4.4,
  },
  {
    title: 'SLRH Jacket',
    price: 9500,
    category: 'Jackets',
    description: 'All-weather racing jacket.',
    image: 'https://picsum.photos/seed/jacket/800/600',
    quantity: 0,
    rating: 4.8,
  },
];

async function run() {
  try {
    await mongoose.connect(MONGO);
    await Product.deleteMany({});
    await Product.insertMany(items);
    console.log('✅ Store seeded with sample products');
  } catch (err) {
    console.error('❌ Error seeding store:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
