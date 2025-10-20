import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// GET all products
router.get('/', async (_req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json({ items });
});

// GET single product
router.get('/:id', async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Product not found' });
  res.json({ item });
});

export default router;
