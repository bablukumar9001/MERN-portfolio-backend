// Tiny dependency-free rate limiter (in-memory).
// Good enough for a low-traffic portfolio contact form. For a multi-instance
// deployment, swap this for a shared store (Redis) or the express-rate-limit pkg.

const createRateLimiter = ({ windowMs, max, message }) => {
  const hits = new Map(); // ip -> [timestamps]

  // Periodically drop stale entries so the map doesn't grow forever.
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [ip, times] of hits) {
      const fresh = times.filter((t) => t > cutoff);
      if (fresh.length) hits.set(ip, fresh);
      else hits.delete(ip);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      "unknown";
    const now = Date.now();
    const cutoff = now - windowMs;

    const times = (hits.get(ip) || []).filter((t) => t > cutoff);
    times.push(now);
    hits.set(ip, times);

    if (times.length > max) {
      return res
        .status(429)
        .json({ error: message || "Too many requests, please try again later." });
    }
    next();
  };
};

module.exports = createRateLimiter;
