// routes/products.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * GET /api/v1/products
 * Returns: { items: [...] }
 */
router.get("/", async (_req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    return res.json({ items });
  } catch (e) {
    console.error("GET /products error:", e);
    return res.status(500).json({ message: "Server error fetching products" });
  }
});

/**
 * GET /api/v1/products/:id
 * Returns: { item: {...} }
 */
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Product not found" });
    return res.json({ item });
  } catch (e) {
    console.error("GET /products/:id error:", e);
    return res.status(500).json({ message: "Server error fetching product" });
  }
});

export default router;
