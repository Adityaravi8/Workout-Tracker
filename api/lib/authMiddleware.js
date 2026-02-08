const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || "dev-refresh-secret-change-in-production";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

function verifyToken(req) {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return { error: "No token provided", status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.userId };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return { error: "Token expired", status: 401 };
    }
    return { error: "Invalid token", status: 401 };
  }
}

function signAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

function signToken(userId) {
  return signAccessToken(userId);
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

function generateTokenFamily() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = {
  verifyToken,
  signToken,
  signAccessToken,
  generateRefreshToken,
  generateTokenFamily,
  JWT_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY_DAYS,
};
