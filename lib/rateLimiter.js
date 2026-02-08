const RateLimit = require("./rateLimitModel");

/**
 *
 * @param {string} key
 * @param {number} limit
 * @param {number} windowMs
 * @returns {Promise<{allowed: boolean, remaining: number, resetAt: Date}>}
 */
async function checkRateLimit(key, limit, windowMs) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);

  try {
    const existing = await RateLimit.findOne({ key });

    if (!existing) {
      await RateLimit.create({
        key,
        count: 1,
        expiresAt,
      });
      return { allowed: true, remaining: limit - 1, resetAt: expiresAt };
    }

    if (existing.expiresAt < now) {
      existing.count = 1;
      existing.expiresAt = expiresAt;
      await existing.save();
      return { allowed: true, remaining: limit - 1, resetAt: expiresAt };
    }

    if (existing.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: existing.expiresAt };
    }

    existing.count += 1;
    await existing.save();
    return {
      allowed: true,
      remaining: limit - existing.count,
      resetAt: existing.expiresAt,
    };
  } catch (err) {
    console.error("Rate limit check error:", err);
    return { allowed: true, remaining: limit, resetAt: expiresAt };
  }
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

module.exports = { checkRateLimit, getClientIp };
