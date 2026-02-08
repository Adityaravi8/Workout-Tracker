const connectDB = require("../_lib/mongodb");
const User = require("../_lib/userModel");
const { verifyToken } = require("../_lib/authMiddleware");
const { setSecurityHeaders } = require("../_lib/securityHeaders");

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

  await connectDB();

  try {
    const user = await User.findById(authResult.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ error: "Failed to verify token" });
  }
};
