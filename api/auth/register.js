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

const REGISTER_RATE_LIMIT = 3;
const REGISTER_RATE_WINDOW_MS = 60 * 60 * 1000;

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
    const rateLimitKey = `register:${clientIp}`;
    const rateLimit = await checkRateLimit(
      rateLimitKey,
      REGISTER_RATE_LIMIT,
      REGISTER_RATE_WINDOW_MS,
    );

    if (!rateLimit.allowed) {
      res.setHeader(
        "Retry-After",
        Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
      );
      return res.status(429).json({
        error: "Too many registration attempts. Please try again later.",
        retryAfter: rateLimit.resetAt,
      });
    }

    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

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

    return res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Failed to register user" });
  }
};
