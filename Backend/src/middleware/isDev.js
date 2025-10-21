// src/middleware/isDev.js
export default function isDev(req, res, next) {
  const adminKey = process.env.ADMIN_KEY;
  const provided = req.headers["x-admin-key"];
  if (adminKey && provided === adminKey) return next();
  return res.status(403).json({ error: "Forbidden" });
}
