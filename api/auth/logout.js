const connectDB = require("../../lib/mongodb");
const RefreshToken = require("../../lib/refreshTokenModel");
const { setSecurityHeaders } = require("../../lib/securityHeaders");
const {
  getRefreshToken,
  clearRefreshTokenCookie,
} = require("../../lib/cookieUtils");
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

    if (refreshTokenValue) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshTokenValue)
        .digest("hex");

      const storedToken = await RefreshToken.findOne({ token: tokenHash });

      if (storedToken) {
        await RefreshToken.updateMany(
          { tokenFamily: storedToken.tokenFamily },
          { isRevoked: true },
        );
      }
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);

    clearRefreshTokenCookie(res);
    return res.status(200).json({ message: "Logged out" });
  }
};
