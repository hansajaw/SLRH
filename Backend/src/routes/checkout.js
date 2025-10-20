import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.post('/', async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ ok: false, error: 'Invalid items' });

  const failures = [];

  for (const { productId, qty } of items) {
    const p = await Product.findById(productId);
    if (!p) { failures.push({ productId, reason: 'NOT_FOUND' }); continue; }
    if (p.quantity < qty) {
      failures.push({
        productId,
        reason: 'OUT_OF_STOCK',
        available: p.quantity,
        needed: qty,
      });
    }
  }

  if (failures.length) return res.status(409).json({ ok: false, failures });

  for (const { productId, qty } of items) {
    await Product.findByIdAndUpdate(productId, { $inc: { quantity: -qty } });
  }

  res.json({ ok: true, orderId: Math.random().toString(36).slice(2) });
});

export default router;
