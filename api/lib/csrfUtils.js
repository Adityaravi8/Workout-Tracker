const crypto = require("crypto");

const CSRF_SECRET =
  process.env.CSRF_SECRET || "dev-csrf-secret-change-in-production";
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

function generateCsrfToken(userId) {
  const timestamp = Date.now().toString();
  const data = `${userId}:${timestamp}`;
  const hmac = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(data)
    .digest("hex");
  return `${timestamp}.${hmac}`;
}

function verifyCsrfToken(token, userId) {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [timestamp, providedHmac] = parts;
  const timestampNum = parseInt(timestamp, 10);

  if (isNaN(timestampNum)) {
    return false;
  }

  if (Date.now() - timestampNum > TOKEN_EXPIRY_MS) {
    return false;
  }

  const data = `${userId}:${timestamp}`;
  const expectedHmac = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(data)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedHmac, "hex"),
      Buffer.from(expectedHmac, "hex"),
    );
  } catch {
    return false;
  }
}

module.exports = { generateCsrfToken, verifyCsrfToken };
