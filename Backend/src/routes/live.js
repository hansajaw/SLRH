// src/routes/live.js
import express from "express";
const router = express.Router();

const LIVE_ID = process.env.LIVE_SESSION_ID || "colombo-practice-001";
const YOUTUBE_VIDEO_ID = process.env.YOUTUBE_VIDEO_ID || "dQw4w9WgXcQ";

// Temporary static data — can later be fetched from your DB
const drivers = [
  { id: "d1", name: "A. Perera", car: "#12 GT-R", team: "Team SLRH", country: "LK" },
  { id: "d2", name: "S. Fernando", car: "#7 Supra", team: "Speed Hawks", country: "LK" },
  { id: "d3", name: "D. Jayasuriya", car: "#21 Civic Type R", team: "Red Grid", country: "LK" },
];

router.get("/:id", (req, res) => {
  const { id } = req.params;

  if (id !== LIVE_ID)
    return res.status(404).json({ error: "Live session not found" });

  res.json({
    id: LIVE_ID,
    youtubeVideoId: YOUTUBE_VIDEO_ID,
    title: "Practice Session – Colombo",
    startTime: new Date().toISOString(),
    drivers,
  });
});

export default router;
