const connectDB = require("../lib/mongodb");
const User = require("../lib/userModel");
const RefreshToken = require("../lib/refreshTokenModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  signAccessToken,
  generateRefreshToken,
  generateTokenFamily,
  REFRESH_TOKEN_EXPIRY_DAYS,
} = require("../lib/authMiddleware");
const { setSecurityHeaders } = require("../lib/securityHeaders");
const { setRefreshTokenCookie } = require("../lib/cookieUtils");
const { checkRateLimit, getClientIp } = require("../lib/rateLimiter");

// Rate limit: 5 attempts per 15 minutes
const LOGIN_RATE_LIMIT = 5;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;

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
    const clientIp = getClientIp(req);
    const rateLimitKey = `login:${clientIp}`;
    const rateLimit = await checkRateLimit(
      rateLimitKey,
      LOGIN_RATE_LIMIT,
      LOGIN_RATE_WINDOW_MS,
    );

    if (!rateLimit.allowed) {
      res.setHeader(
        "Retry-After",
        Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
      );
      return res.status(429).json({
        error: "Too many login attempts. Please try again later.",
        retryAfter: rateLimit.resetAt,
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = generateRefreshToken();
    const tokenFamily = generateTokenFamily();

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await RefreshToken.create({
      userId: user._id,
      token: tokenHash,
      tokenFamily,
      expiresAt: new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      ),
      userAgent: req.headers["user-agent"] || "",
      ipAddress: clientIp,
    });

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Failed to login" });
  }
};
