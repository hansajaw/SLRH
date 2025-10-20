import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.post('/validate-add', async (req, res) => {
  const { productId, qty = 1 } = req.body || {};
  const p = await Product.findById(productId);
  if (!p) return res.status(404).json({ ok: false, reason: 'NOT_FOUND' });
  if (p.quantity < qty)
    return res.json({ ok: false, reason: 'OUT_OF_STOCK', stock: p.quantity });
  res.json({ ok: true, stock: p.quantity });
});

export default router;
