const connectDB = require("../../lib/mongodb");
const RefreshToken = require("../../lib/refreshTokenModel");
const { setSecurityHeaders } = require("../../lib/securityHeaders");
const {
  getRefreshToken,
  setRefreshTokenCookie,
} = require("../../lib/cookieUtils");
const {
  signAccessToken,
  generateRefreshToken,
  REFRESH_SECRET,
} = require("../../lib/authMiddleware");
const crypto = require("crypto");

module.exports = async function handler(req, res) {
  setSecurityHeaders(res, "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  try {
    const refreshTokenValue = getRefreshToken(req);

    if (!refreshTokenValue) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshTokenValue)
      .digest("hex");

    const storedToken = await RefreshToken.findOne({ token: tokenHash });

    if (!storedToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    if (storedToken.isRevoked) {
      await RefreshToken.updateMany(
        { tokenFamily: storedToken.tokenFamily },
        { isRevoked: true },
      );
      return res
        .status(401)
        .json({ error: "Token reuse detected. Please login again." });
    }

    if (storedToken.expiresAt < new Date()) {
      return res.status(401).json({ error: "Refresh token expired" });
    }

    storedToken.isRevoked = true;
    await storedToken.save();

    const newAccessToken = signAccessToken(storedToken.userId);
    const newRefreshToken = generateRefreshToken();
    const newTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await RefreshToken.create({
      userId: storedToken.userId,
      token: newTokenHash,
      tokenFamily: storedToken.tokenFamily,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: req.headers["user-agent"] || "",
      ipAddress: getClientIp(req),
    });

    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Token refresh error:", err);
    return res.status(500).json({ error: "Failed to refresh token" });
  }
};

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}
