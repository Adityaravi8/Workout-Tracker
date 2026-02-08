const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function setRefreshTokenCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = [
    `${REFRESH_TOKEN_COOKIE_NAME}=${token}`,
    `HttpOnly`,
    `Max-Age=${REFRESH_TOKEN_MAX_AGE}`,
    `Path=/`,
    `SameSite=Strict`,
  ];

  if (isProduction) {
    cookieOptions.push("Secure");
  }

  res.setHeader("Set-Cookie", cookieOptions.join("; "));
}

function clearRefreshTokenCookie(res) {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = [
    `${REFRESH_TOKEN_COOKIE_NAME}=`,
    `HttpOnly`,
    `Max-Age=0`,
    `Path=/`,
    `SameSite=Strict`,
  ];

  if (isProduction) {
    cookieOptions.push("Secure");
  }

  res.setHeader("Set-Cookie", cookieOptions.join("; "));
}

function parseCookies(req) {
  const cookies = {};
  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, ...valueParts] = cookie.trim().split("=");
      cookies[name] = valueParts.join("=");
    });
  }

  return cookies;
}

function getRefreshToken(req) {
  const cookies = parseCookies(req);
  return cookies[REFRESH_TOKEN_COOKIE_NAME] || null;
}

module.exports = {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  parseCookies,
  getRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME,
};
