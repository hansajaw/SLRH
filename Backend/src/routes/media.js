// src/routes/media.js
import { Router } from "express";
import { Video, Album, MediaImage, News } from "../models/media.js";
import isDev from "../middleware/isDev.js";

const r = Router();

/* ------- PUBLIC READ ROUTES ------- */
r.get("/videos", async (_req, res) => {
  const data = await Video.find().sort({ createdAt: -1 }).lean();
  res.json(data);
});

r.get("/albums", async (_req, res) => {
  const data = await Album.find().sort({ createdAt: -1 }).lean();
  res.json(data);
});

r.get("/albums/:id/images", async (req, res) => {
  const data = await MediaImage.find({ album: req.params.id }).sort({ createdAt: -1 }).lean();
  res.json(data);
});

r.get("/news", async (_req, res) => {
  const data = await News.find().sort({ publishedAt: -1 }).lean();
  res.json(data);
});

/* ------- DEV-ONLY WRITE ROUTES ------- */
r.post("/videos", isDev, async (req, res) => {
  const doc = await Video.create(req.body);
  res.json(doc);
});

r.post("/albums", isDev, async (req, res) => {
  const doc = await Album.create(req.body);
  res.json(doc);
});

r.post("/albums/:id/images", isDev, async (req, res) => {
  const doc = await MediaImage.create({ ...req.body, album: req.params.id });
  res.json(doc);
});

r.post("/news", isDev, async (req, res) => {
  const doc = await News.create(req.body);
  res.json(doc);
});

export default r;
