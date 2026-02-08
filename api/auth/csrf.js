const { setSecurityHeaders } = require("../lib/securityHeaders");
const { verifyToken } = require("../lib/authMiddleware");
const { generateCsrfToken } = require("../lib/csrfUtils");

module.exports = async function handler(req, res) {
  setSecurityHeaders(res, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authResult = verifyToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  try {
    const csrfToken = generateCsrfToken(authResult.userId);
    return res.status(200).json({ csrfToken });
  } catch (err) {
    console.error("CSRF token generation error:", err);
    return res.status(500).json({ error: "Failed to generate CSRF token" });
  }
};
